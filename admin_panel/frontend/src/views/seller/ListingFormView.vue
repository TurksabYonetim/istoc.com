<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 dark:bg-[#2a2a35] dark:text-gray-300 dark:hover:bg-[#35354a] transition-colors flex-shrink-0">
          <AppIcon name="arrow-left" :size="14" />
        </button>
        <div>
          <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100">
            {{ isNew ? 'Yeni Ürün' : (form.title || docName) }}
          </h1>
          <p class="text-xs text-gray-400">{{ isNew ? 'Yeni listing oluştur' : docName }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="hdr-btn-outlined" @click="goBack">Geri</button>
        <button class="hdr-btn-primary" :disabled="saving" @click="saveDoc">
          <AppIcon v-if="saving" name="loader" :size="13" class="animate-spin" />
          <AppIcon v-else name="save" :size="13" />
          {{ isNew ? 'Oluştur' : 'Kaydet' }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card text-center py-12">
      <AppIcon name="loader" :size="24" class="text-violet-500 animate-spin mx-auto" />
      <p class="text-sm text-gray-400 mt-3">Yükleniyor...</p>
    </div>

    <div v-else>
      <!-- Tabs -->
      <div class="flex overflow-x-auto gap-1 mb-4 bg-white dark:bg-[#13131a] border border-gray-200 dark:border-white/8 rounded-xl p-1">
        <button
          v-for="tab in tabs" :key="tab.key"
          @click="activeTab = tab.key"
          :class="['flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors',
            activeTab === tab.key
              ? 'bg-violet-600 text-white shadow'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5']"
        >
          <AppIcon :name="tab.icon" :size="12" />
          {{ tab.label }}
        </button>
      </div>

      <!-- ───── TAB: Detaylar ───── -->
      <div v-show="activeTab === 'details'" class="card space-y-4">
        <h3 class="section-title">Temel Bilgiler</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="form-label">Listing Kodu <span class="text-gray-400 font-normal text-[10px]">(otomatik)</span></label>
            <input :value="form.listing_code" readonly class="form-input opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label class="form-label">Başlık <span class="text-red-500">*</span></label>
            <input v-model="form.title" type="text" class="form-input" placeholder="Ürün başlığı" />
          </div>
          <div>
            <label class="form-label">Satıcı Profili</label>
            <input :value="form.seller_profile" readonly class="form-input opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label class="form-label">Durum <span class="text-red-500">*</span></label>
            <select v-model="form.status" class="form-input">
              <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value"
                :disabled="!isAdmin && adminOnlyStatuses.includes(opt.value)">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="form-label">Listing Tipi</label>
            <select v-model="form.listing_type" class="form-input">
              <option value="Fixed Price">Fixed Price</option>
              <option value="Auction">Auction</option>
              <option value="RFQ Only">RFQ Only</option>
            </select>
          </div>
          <div>
            <label class="form-label">Kategori</label>
            <select v-model="form.category" class="form-input">
              <option value="">Kategori seçiniz...</option>
              <option v-for="cat in sellerCategories" :key="cat.name" :value="cat.name">
                {{ cat.category_name }}
              </option>
            </select>
            <p v-if="sellerCategories.length === 0" class="text-[10px] text-amber-500 mt-1">
              Onaylanmış kategoriniz yok. Önce <a @click.prevent="$router.push('/seller-categories')" href="#" class="underline">kategori ekleyin</a>.
            </p>
          </div>
          <!-- Platform Kategorisi -->
          <div class="lg:col-span-2">
            <label class="form-label">Platform Kategorisi</label>
            <div class="flex items-center gap-2">
              <button type="button" @click="openCategoryPicker"
                class="flex-1 form-input text-left flex items-center gap-2 min-h-[38px] hover:border-violet-400 transition-colors cursor-pointer"
                :class="categoryPickerPath.length ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'">
                <AppIcon name="folder-tree" :size="14" class="flex-shrink-0 text-violet-500" />
                <span v-if="categoryPickerPath.length" class="text-xs truncate">
                  {{ categoryPickerPath.map(c => c.category_name).join(' › ') }}
                </span>
                <span v-else class="text-xs">Kategori seçmek için tıklayın...</span>
              </button>
              <button v-if="categoryPickerPath.length" type="button" @click="clearProductCategory"
                class="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/8 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Temizle">
                <AppIcon name="x" :size="14" />
              </button>
            </div>
          </div>

          <div>
            <label class="form-label">Marka</label>
            <input v-model="form.brand" type="text" class="form-input" placeholder="Marka" />
          </div>
          <div>
            <label class="form-label">Kondisyon</label>
            <select v-model="form.condition" class="form-input">
              <option value="New">Yeni</option>
              <option value="Used - Like New">Kullanılmış - Yeni Gibi</option>
              <option value="Used - Good">Kullanılmış - İyi</option>
              <option value="Refurbished">Yenilenmiş</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ───── TAB: Açıklama ───── -->
      <div v-show="activeTab === 'description'" class="card space-y-4">
        <h3 class="section-title">Açıklama</h3>
        <div>
          <label class="form-label">Kısa Açıklama</label>
          <textarea v-model="form.short_description" rows="3" class="form-input resize-none" placeholder="Kısa açıklama..."></textarea>
        </div>
        <div>
          <label class="form-label">Açıklama</label>
          <textarea v-model="form.description" rows="8" class="form-input resize-none font-mono text-xs" placeholder="Detaylı ürün açıklaması..."></textarea>
        </div>
      </div>

      <!-- ───── TAB: Fiyatlandırma ───── -->
      <div v-show="activeTab === 'pricing'" class="space-y-4">
        <div class="card space-y-4">
          <h3 class="section-title">Fiyatlandırma</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Para Birimi <span class="text-red-500">*</span></label>
              <select v-model="form.currency" class="form-input">
                <option value="">Seçiniz...</option>
                <option v-for="c in currencies" :key="c.name" :value="c.name">
                  {{ c.name }}{{ c.currency_name && c.currency_name !== c.name ? ' — ' + c.currency_name : '' }}
                </option>
              </select>
            </div>
            <div>
              <label class="form-label">Taban Fiyat <span class="text-red-500">*</span></label>
              <input v-model.number="form.base_price" type="number" step="0.01" min="0" class="form-input" placeholder="0.00" />
            </div>
            <div>
              <label class="form-label">Satış Fiyatı <span class="text-red-500">*</span></label>
              <input v-model.number="form.selling_price" type="number" step="0.01" min="0" class="form-input" placeholder="0.00" />
            </div>
            <div>
              <label class="form-label">Karşılaştırma Fiyatı</label>
              <input v-model.number="form.compare_at_price" type="number" step="0.01" min="0" class="form-input" placeholder="0.00" />
            </div>
            <div>
              <label class="form-label">İndirim %</label>
              <input v-model.number="form.discount_percentage" type="number" step="0.01" min="0" max="100" class="form-input" placeholder="0" />
            </div>
            <div>
              <label class="form-label">Numune Fiyatı</label>
              <input v-model.number="form.sample_price" type="number" step="0.01" min="0" class="form-input" placeholder="0.00" />
            </div>
          </div>
        </div>

        <div class="card space-y-4">
          <div class="flex items-center gap-3">
            <input type="checkbox" id="b2b_enabled" v-model="form.b2b_enabled" :true-value="1" :false-value="0" class="form-checkbox rounded text-violet-600 w-4 h-4" />
            <label for="b2b_enabled" class="text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer">B2B Toplu Fiyatlandırma Etkinleştir</label>
          </div>
          <div v-if="form.b2b_enabled">
            <ChildTable
              v-model="childData.pricing_tiers"
              :columns="[
                { key: 'min_qty', label: 'Min Adet', type: 'number', reqd: true },
                { key: 'max_qty', label: 'Max Adet', type: 'number' },
                { key: 'price', label: 'Fiyat', type: 'number', reqd: true },
                { key: 'discount_percentage', label: 'İndirim %', type: 'number' },
              ]"
              child-doctype="Listing Bulk Pricing Tier"
              add-label="Fiyat Kademesi Ekle"
            />
          </div>
        </div>
      </div>

      <!-- ───── TAB: Envanter ───── -->
      <div v-show="activeTab === 'inventory'" class="card space-y-4">
        <h3 class="section-title">Envanter</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="form-label">Stok Adedi</label>
            <input v-model.number="form.stock_qty" type="number" step="0.001" min="0" class="form-input" placeholder="0" />
          </div>
          <div>
            <label class="form-label">Rezerve Adedi <span class="text-gray-400 font-normal text-[10px]">(salt okunur)</span></label>
            <input :value="form.reserved_qty || 0" readonly class="form-input opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label class="form-label">Mevcut Adedi <span class="text-gray-400 font-normal text-[10px]">(salt okunur)</span></label>
            <input :value="form.available_qty || 0" readonly class="form-input opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label class="form-label">Stok Birimi</label>
            <LinkInput v-model="form.stock_uom" doctype="UOM" placeholder="Birim ara..." />
          </div>
          <div>
            <label class="form-label">Min Sipariş Adedi</label>
            <input v-model.number="form.min_order_qty" type="number" min="1" class="form-input" placeholder="1" />
          </div>
          <div>
            <label class="form-label">Max Sipariş Adedi</label>
            <input v-model.number="form.max_order_qty" type="number" min="0" class="form-input" placeholder="0" />
          </div>
          <div>
            <label class="form-label">Düşük Stok Eşiği</label>
            <input v-model.number="form.low_stock_threshold" type="number" min="0" class="form-input" placeholder="5" />
          </div>
          <div class="flex flex-col gap-3 pt-1">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form.track_inventory" :true-value="1" :false-value="0" class="form-checkbox rounded text-violet-600 w-4 h-4" />
              <span class="text-sm text-gray-700 dark:text-gray-300">Stok Takibi</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form.allow_backorders" :true-value="1" :false-value="0" class="form-checkbox rounded text-violet-600 w-4 h-4" />
              <span class="text-sm text-gray-700 dark:text-gray-300">Stoksuz Sipariş İzni</span>
            </label>
          </div>
        </div>
      </div>

      <!-- ───── TAB: Medya ───── -->
      <div v-show="activeTab === 'media'" class="space-y-4">
        <div class="card space-y-4">
          <h3 class="section-title">Ana Görsel</h3>
          <div class="flex items-start gap-4">
            <img v-if="form.primary_image" :src="form.primary_image"
              class="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-white/10 flex-shrink-0" alt="Ana görsel" />
            <div class="flex-1 space-y-2">
              <p v-if="form.primary_image" class="text-xs text-gray-400 break-all">{{ form.primary_image }}</p>
              <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-white/15 cursor-pointer hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-colors w-fit"
                :class="uploadingField === 'primary_image' ? 'opacity-60 pointer-events-none' : ''">
                <AppIcon :name="uploadingField === 'primary_image' ? 'loader' : 'image'" :size="14"
                  :class="uploadingField === 'primary_image' ? 'animate-spin text-violet-500' : 'text-gray-400'" />
                <span class="text-xs text-gray-500">{{ uploadingField === 'primary_image' ? 'Yükleniyor...' : (form.primary_image ? 'Değiştir' : 'Ana görsel seç') }}</span>
                <input type="file" accept="image/*" class="hidden" @change="uploadImage('primary_image', $event)" />
              </label>
              <button v-if="form.primary_image" @click="form.primary_image = ''" class="text-xs text-red-500 hover:text-red-700">Kaldır</button>
            </div>
          </div>
        </div>

        <div class="card space-y-4">
          <h3 class="section-title">Ek Görseller</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="(img, idx) in childData.listing_images" :key="idx"
              class="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/3">
              <img v-if="img.image" :src="img.image" class="w-full h-full object-cover" :alt="img.alt_text || ''" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <AppIcon name="image" :size="24" class="text-gray-300" />
              </div>
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <label class="cursor-pointer bg-white/20 rounded-lg p-1.5 hover:bg-white/30" title="Görsel değiştir">
                  <AppIcon name="upload" :size="14" class="text-white" />
                  <input type="file" accept="image/*" class="hidden" @change="uploadImageRow(idx, $event)" />
                </label>
                <button @click="removeImageRow(idx)" class="bg-red-500/80 rounded-lg p-1.5 hover:bg-red-600" title="Kaldır">
                  <AppIcon name="trash-2" :size="14" class="text-white" />
                </button>
              </div>
              <input v-model="img.alt_text" type="text" class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-2 py-1 border-0 outline-none placeholder-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" placeholder="Alt metin..." />
            </div>
            <!-- Ekle butonu -->
            <label class="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-white/15 cursor-pointer hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-colors flex flex-col items-center justify-center gap-1"
              :class="uploadingImageRow ? 'opacity-60 pointer-events-none' : ''">
              <AppIcon :name="uploadingImageRow ? 'loader' : 'plus'" :size="20" :class="uploadingImageRow ? 'animate-spin text-violet-500' : 'text-gray-400'" />
              <span class="text-xs text-gray-400">{{ uploadingImageRow ? 'Yükleniyor...' : 'Görsel ekle' }}</span>
              <input type="file" accept="image/*" class="hidden" @change="addImageRow($event)" />
            </label>
          </div>
        </div>

        <div class="card">
          <label class="form-label">Video URL</label>
          <input v-model="form.video_url" type="url" class="form-input" placeholder="https://..." />
        </div>
      </div>

      <!-- ───── TAB: Özellikler ───── -->
      <div v-show="activeTab === 'specs'" class="card space-y-4">
        <h3 class="section-title">Ürün Özellikleri</h3>
        <ChildTable
          v-model="childData.attribute_values"
          :columns="[
            { key: 'attribute_name', label: 'Özellik Adı', type: 'text', reqd: true, placeholder: 'ör: Renk' },
            { key: 'attribute_value', label: 'Değer', type: 'text', reqd: true, placeholder: 'ör: Kırmızı' },
            { key: 'attribute_group', label: 'Grup', type: 'text', placeholder: 'ör: Fiziksel' },
          ]"
          child-doctype="Listing Attribute Value"
          add-label="Özellik Ekle"
        />
      </div>

      <!-- ───── TAB: Varyantlar ───── -->
      <div v-show="activeTab === 'variants'" class="space-y-4">
        <div class="card space-y-4">
          <div class="flex items-center gap-3">
            <input type="checkbox" id="has_variants" v-model="form.has_variants" :true-value="1" :false-value="0" class="form-checkbox rounded text-violet-600 w-4 h-4" />
            <label for="has_variants" class="text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer">Varyant Var</label>
          </div>
          <p class="text-xs text-gray-400">Renk, beden, malzeme gibi farklı seçenekler için varyant ekleyin.</p>

          <div v-if="form.has_variants">
            <ChildTable
              v-model="childData.variant_items"
              :columns="[
                { key: 'attribute_type', label: 'Özellik Türü', type: 'text', reqd: true, placeholder: 'ör: Renk' },
                { key: 'attribute_value', label: 'Değer', type: 'text', reqd: true, placeholder: 'ör: Kırmızı' },
                { key: 'variant_price', label: 'Fiyat', type: 'number' },
                { key: 'variant_stock', label: 'Stok', type: 'number' },
                { key: 'variant_sku', label: 'SKU', type: 'text' },
              ]"
              child-doctype="Listing Variant Item"
              add-label="Varyant Ekle"
            />
          </div>
        </div>

        <div class="card space-y-4">
          <h3 class="section-title">Özelleştirme Seçenekleri</h3>
          <ChildTable
            v-model="childData.customization_options"
            :columns="[
              { key: 'option_name', label: 'Seçenek Adı', type: 'text', reqd: true, placeholder: 'ör: Kişiselleştirme' },
              { key: 'description', label: 'Açıklama', type: 'text' },
              { key: 'additional_cost', label: 'Ek Ücret', type: 'number' },
              { key: 'min_qty', label: 'Min Adet', type: 'number' },
            ]"
            child-doctype="Listing Customization Option"
            add-label="Seçenek Ekle"
          />
        </div>
      </div>

      <!-- ───── TAB: Kargo ───── -->
      <div v-show="activeTab === 'shipping'" class="space-y-4">
        <div class="card space-y-4">
          <h3 class="section-title">Kargo Bilgileri</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="flex items-center gap-2 pt-1 lg:col-span-2">
              <input type="checkbox" id="is_free_shipping" v-model="form.is_free_shipping" :true-value="1" :false-value="0" class="form-checkbox rounded text-violet-600 w-4 h-4" />
              <label for="is_free_shipping" class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Ücretsiz Kargo</label>
            </div>
            <div>
              <label class="form-label">Kargo Ağırlığı (kg)</label>
              <input v-model.number="form.shipping_weight" type="number" step="0.001" min="0" class="form-input" placeholder="0.000" />
            </div>
            <div>
              <label class="form-label">Kargolama Günü</label>
              <input v-model.number="form.handling_days" type="number" min="0" class="form-input" placeholder="1" />
            </div>
            <div>
              <label class="form-label">Kargolanan Ülke</label>
              <LinkInput v-model="form.ships_from_country" doctype="Country" placeholder="Ülke ara..." />
            </div>
            <div>
              <label class="form-label">Kargolanan Şehir</label>
              <input v-model="form.ships_from_city" type="text" class="form-input" placeholder="Şehir" />
            </div>
            <div>
              <label class="form-label">Menşei Ülke</label>
              <LinkInput v-model="form.country_of_origin" doctype="Country" placeholder="Ülke ara..." />
            </div>
          </div>
        </div>

        <div class="card space-y-4">
          <h3 class="section-title">Paket Boyutları</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Paket Tipi</label>
              <select v-model="form.package_type" class="form-input">
                <option value="">Seçiniz...</option>
                <option>Karton Kutu</option><option>Poşet</option><option>Ahşap Kasa</option>
                <option>Palet</option><option>File</option><option>Torba</option><option>Diğer</option>
              </select>
            </div>
            <div>
              <label class="form-label">Adet / Paket</label>
              <input v-model.number="form.units_per_package" type="number" min="0" class="form-input" placeholder="0" />
            </div>
            <div>
              <label class="form-label">Uzunluk (cm)</label>
              <input v-model.number="form.package_length" type="number" step="0.01" min="0" class="form-input" placeholder="0.00" />
            </div>
            <div>
              <label class="form-label">Genişlik (cm)</label>
              <input v-model.number="form.package_width" type="number" step="0.01" min="0" class="form-input" placeholder="0.00" />
            </div>
            <div>
              <label class="form-label">Yükseklik (cm)</label>
              <input v-model.number="form.package_height" type="number" step="0.01" min="0" class="form-input" placeholder="0.00" />
            </div>
            <div>
              <label class="form-label">Ağırlık (kg)</label>
              <input v-model.number="form.package_weight" type="number" step="0.001" min="0" class="form-input" placeholder="0.000" />
            </div>
          </div>
          <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide pt-2">Karton Ölçüleri</h4>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Uzunluk (cm)</label>
              <input v-model.number="form.carton_length" type="number" step="0.01" min="0" class="form-input" placeholder="0.00" />
            </div>
            <div>
              <label class="form-label">Genişlik (cm)</label>
              <input v-model.number="form.carton_width" type="number" step="0.01" min="0" class="form-input" placeholder="0.00" />
            </div>
            <div>
              <label class="form-label">Yükseklik (cm)</label>
              <input v-model.number="form.carton_height" type="number" step="0.01" min="0" class="form-input" placeholder="0.00" />
            </div>
            <div>
              <label class="form-label">Brüt Ağırlık (kg)</label>
              <input v-model.number="form.carton_gross_weight" type="number" step="0.001" min="0" class="form-input" placeholder="0.000" />
            </div>
          </div>
        </div>

        <div class="card space-y-4">
          <h3 class="section-title">Teslim Süreleri</h3>
          <ChildTable
            v-model="childData.lead_time_ranges"
            :columns="[
              { key: 'min_qty', label: 'Min Adet', type: 'number', reqd: true },
              { key: 'max_qty', label: 'Max Adet', type: 'number' },
              { key: 'lead_days', label: 'Gün', type: 'number', reqd: true },
            ]"
            child-doctype="Listing Lead Time Range"
            add-label="Süre Ekle"
          />
        </div>

        <div class="card space-y-4">
          <h3 class="section-title">Kargo Yöntemleri</h3>
          <ChildTable
            v-model="childData.shipping_methods"
            :columns="[
              { key: 'shipping_method_name', label: 'Yöntem Adı', type: 'text', reqd: true },
              { key: 'cost', label: 'Ücret', type: 'number', reqd: true },
              { key: 'min_days', label: 'Min Gün', type: 'number' },
              { key: 'max_days', label: 'Max Gün', type: 'number' },
            ]"
            child-doctype="Shipping Method Item"
            add-label="Yöntem Ekle"
          />
        </div>
      </div>

      <!-- ───── TAB: Ayarlar ───── -->
      <div v-show="activeTab === 'settings'" class="card space-y-4">
        <h3 class="section-title">Görünürlük & Etiketler</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="space-y-3">
            <label v-for="f in checkboxFields" :key="f.key" class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form[f.key]" :true-value="1" :false-value="0" class="form-checkbox rounded text-violet-600 w-4 h-4" />
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ f.label }}</span>
            </label>
          </div>
          <div>
            <label class="form-label">Satış Noktası</label>
            <input v-model="form.selling_point" type="text" class="form-input" placeholder="ör: 180 gün en düşük fiyat" />
          </div>
        </div>
      </div>

      <!-- ───── TAB: İstatistikler ───── -->
      <div v-show="activeTab === 'statistics'" class="card">
        <h3 class="section-title">İstatistikler <span class="font-normal text-xs text-gray-400">(salt okunur)</span></h3>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div v-for="f in statsFields" :key="f.key" class="bg-gray-50 dark:bg-white/3 rounded-xl p-4 text-center">
            <p class="text-xs text-gray-400 mb-1">{{ f.label }}</p>
            <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ form[f.key] || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- ───── TAB: SEO ───── -->
      <div v-show="activeTab === 'seo'" class="card space-y-4">
        <h3 class="section-title">SEO</h3>
        <div>
          <label class="form-label">Route</label>
          <input v-model="form.route" type="text" class="form-input" placeholder="/urun/gömlek" />
        </div>
        <div>
          <label class="form-label">Meta Başlık</label>
          <input v-model="form.meta_title" type="text" class="form-input" placeholder="Sayfa başlığı" />
        </div>
        <div>
          <label class="form-label">Meta Açıklama</label>
          <textarea v-model="form.meta_description" rows="3" class="form-input resize-none" placeholder="Sayfa açıklaması..."></textarea>
        </div>
        <div>
          <label class="form-label">Meta Anahtar Kelimeler</label>
          <textarea v-model="form.meta_keywords" rows="2" class="form-input resize-none" placeholder="kelime1, kelime2, ..."></textarea>
        </div>
      </div>

      <!-- ───── TAB: Sistem ───── -->
      <div v-show="activeTab === 'system'" class="card space-y-4">
        <h3 class="section-title">Sistem <span class="font-normal text-xs text-gray-400">(salt okunur)</span></h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="form-label">ERPNext Ürünü</label>
            <input :value="form.erpnext_item || '-'" readonly class="form-input opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label class="form-label">Yayınlanma Tarihi</label>
            <input :value="form.published_at ? new Date(form.published_at).toLocaleString('tr-TR') : '-'" readonly class="form-input opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label class="form-label">Oluşturulma</label>
            <input :value="form.creation ? new Date(form.creation).toLocaleString('tr-TR') : '-'" readonly class="form-input opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label class="form-label">Son Güncelleme</label>
            <input :value="form.modified ? new Date(form.modified).toLocaleString('tr-TR') : '-'" readonly class="form-input opacity-60 cursor-not-allowed" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Platform Kategori Seçici Modal ───────────────────────────────────── -->
  <Teleport to="body">
    <div v-if="categoryPicker.show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="categoryPicker.show = false">
      <div class="bg-white dark:bg-[#1a1a24] rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">

        <!-- Modal başlık -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/8 flex-shrink-0">
          <div class="flex items-center gap-2">
            <AppIcon name="folder-tree" :size="16" class="text-violet-500" />
            <h2 class="text-sm font-bold text-gray-900 dark:text-gray-100">Platform Kategorisi Seç</h2>
          </div>
          <button @click="categoryPicker.show = false"
            class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/8 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <AppIcon name="x" :size="14" />
          </button>
        </div>

        <!-- Breadcrumb navigasyon -->
        <div class="flex items-center gap-1 px-5 py-2.5 border-b border-gray-100 dark:border-white/5 flex-shrink-0 overflow-x-auto">
          <button @click="categoryPickerGoTo(-1)"
            class="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
            :class="categoryPicker.path.length === 0 ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'">
            <AppIcon name="home" :size="11" />
            <span>Kök</span>
          </button>
          <template v-for="(crumb, idx) in categoryPicker.path" :key="crumb.name">
            <AppIcon name="chevron-right" :size="11" class="text-gray-300 dark:text-gray-600 flex-shrink-0" />
            <button @click="categoryPickerGoTo(idx)"
              class="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors flex-shrink-0 max-w-[120px]"
              :class="idx === categoryPicker.path.length - 1 ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'">
              <span class="truncate">{{ crumb.category_name }}</span>
            </button>
          </template>
        </div>

        <!-- Kategori listesi -->
        <div class="flex-1 overflow-y-auto py-2">
          <!-- Yükleniyor -->
          <div v-if="categoryPicker.loading" class="flex items-center justify-center py-10 gap-2 text-gray-400">
            <AppIcon name="loader" :size="18" class="animate-spin text-violet-500" />
            <span class="text-sm">Yükleniyor...</span>
          </div>

          <!-- Boş -->
          <div v-else-if="categoryPicker.items.length === 0" class="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
            <AppIcon name="folder-open" :size="28" />
            <p class="text-sm">Bu seviyede kategori yok</p>
          </div>

          <!-- Liste -->
          <div v-else class="px-2 space-y-0.5">
            <div v-for="cat in categoryPicker.items" :key="cat.name"
              class="group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/4 transition-colors"
              @click="selectCategoryItem(cat)">
              <!-- İkon -->
              <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                :class="cat.child_count > 0 ? 'bg-violet-100 dark:bg-violet-900/40' : 'bg-gray-100 dark:bg-white/8'">
                <AppIcon :name="cat.child_count > 0 ? 'folder' : 'tag'" :size="14"
                  :class="cat.child_count > 0 ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400'" />
              </div>

              <!-- İsim ve alt sayı -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ cat.category_name }}</p>
                <p v-if="cat.child_count > 0" class="text-[10px] text-gray-400">{{ cat.child_count }} alt kategori</p>
              </div>

              <!-- Aksiyon -->
              <div class="flex items-center gap-1 flex-shrink-0">
                <!-- Yaprak → Seç butonu -->
                <button v-if="cat.child_count === 0" type="button"
                  @click.stop="confirmCategory(cat)"
                  class="opacity-0 group-hover:opacity-100 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-all">
                  Seç
                </button>
                <!-- Alt kategori varsa hem seç hem drill-down ok -->
                <template v-else>
                  <button type="button"
                    @click.stop="confirmCategory(cat)"
                    class="opacity-0 group-hover:opacity-100 px-2 py-1 rounded-lg text-[11px] font-semibold border border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all">
                    Seç
                  </button>
                  <div class="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-violet-500 transition-colors">
                    <AppIcon name="chevron-right" :size="16" />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal alt -->
        <div class="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-white/8 flex-shrink-0">
          <button type="button" @click="clearProductCategory(); categoryPicker.show = false"
            class="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
            <AppIcon name="trash-2" :size="12" />
            Seçimi Temizle
          </button>
          <button type="button" @click="categoryPicker.show = false"
            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/12 transition-colors">
            Kapat
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import api from '@/utils/api'
import AppIcon from '@/components/common/AppIcon.vue'
import LinkInput from '@/components/common/LinkInput.vue'
import ChildTable from '@/components/common/ChildTable.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const auth = useAuthStore()

const loading = ref(false)
const saving = ref(false)
const uploadingField = ref(null)
const uploadingImageRow = ref(false)
const sellerCategories = ref([])
const currencies = ref([])

const docName = computed(() => decodeURIComponent(route.params.name || ''))
const isNew = computed(() => docName.value === 'new')
const isAdmin = computed(() => auth.isAdmin)

const adminOnlyStatuses = ['Pending', 'Rejected', 'Draft']

const statusOptions = [
  { value: 'Pending', label: 'Onay Bekliyor' },
  { value: 'Draft', label: 'Taslak' },
  { value: 'Active', label: 'Aktif' },
  { value: 'Paused', label: 'Duraklatıldı' },
  { value: 'Out of Stock', label: 'Stok Yok' },
  { value: 'Archived', label: 'Arşivlendi' },
  { value: 'Rejected', label: 'Reddedildi' },
]

const tabs = [
  { key: 'details', label: 'Detaylar', icon: 'file-text' },
  { key: 'description', label: 'Açıklama', icon: 'align-left' },
  { key: 'pricing', label: 'Fiyatlandırma', icon: 'tag' },
  { key: 'inventory', label: 'Envanter', icon: 'package' },
  { key: 'media', label: 'Medya', icon: 'image' },
  { key: 'specs', label: 'Özellikler', icon: 'list' },
  { key: 'variants', label: 'Varyantlar', icon: 'layers' },
  { key: 'shipping', label: 'Kargo', icon: 'truck' },
  { key: 'settings', label: 'Ayarlar', icon: 'settings' },
  { key: 'statistics', label: 'İstatistikler', icon: 'bar-chart-2' },
  { key: 'seo', label: 'SEO', icon: 'search' },
  { key: 'system', label: 'Sistem', icon: 'cpu' },
]

const activeTab = ref('details')

const form = reactive({
  listing_code: '',
  title: '',
  seller_profile: '',
  supplier_display_name: '',
  status: 'Pending',
  listing_type: 'Fixed Price',
  category: '',
  category_name: '',
  product_category: '',
  product_category_name: '',
  brand: '',
  condition: 'New',
  short_description: '',
  description: '',
  currency: 'USD',
  base_price: 0,
  selling_price: 0,
  compare_at_price: 0,
  discount_percentage: 0,
  sample_price: 0,
  b2b_enabled: 1,
  stock_qty: 0,
  reserved_qty: 0,
  available_qty: 0,
  stock_uom: 'Nos',
  min_order_qty: 1,
  max_order_qty: 0,
  low_stock_threshold: 5,
  track_inventory: 1,
  allow_backorders: 0,
  primary_image: '',
  video_url: '',
  has_variants: 0,
  is_free_shipping: 0,
  shipping_weight: 0,
  ships_from_country: 'Turkey',
  ships_from_city: '',
  handling_days: 1,
  country_of_origin: '',
  package_type: '',
  package_length: 0,
  package_width: 0,
  package_height: 0,
  package_weight: 0,
  units_per_package: 0,
  carton_length: 0,
  carton_width: 0,
  carton_height: 0,
  carton_gross_weight: 0,
  is_featured: 0,
  is_best_seller: 0,
  is_new_arrival: 0,
  is_on_sale: 0,
  is_visible: 1,
  is_searchable: 1,
  selling_point: '',
  view_count: 0,
  wishlist_count: 0,
  order_count: 0,
  average_rating: 0,
  review_count: 0,
  route: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  erpnext_item: '',
  published_at: '',
  creation: '',
  modified: '',
})

const childData = reactive({
  pricing_tiers: [],
  listing_images: [],
  attribute_values: [],
  variant_items: [],
  customization_options: [],
  lead_time_ranges: [],
  shipping_methods: [],
})

const checkboxFields = [
  { key: 'is_featured', label: 'Öne Çıkan' },
  { key: 'is_best_seller', label: 'Çok Satan' },
  { key: 'is_new_arrival', label: 'Yeni Gelenler' },
  { key: 'is_on_sale', label: 'İndirimde' },
  { key: 'is_visible', label: 'Görünür' },
  { key: 'is_searchable', label: 'Aranabilir' },
]

const statsFields = [
  { key: 'view_count', label: 'Görüntülenme' },
  { key: 'wishlist_count', label: 'Favoriye Ekleme' },
  { key: 'order_count', label: 'Sipariş' },
  { key: 'average_rating', label: 'Ortalama Puan' },
  { key: 'review_count', label: 'Değerlendirme' },
]

// ── Para birimlerini yükle ────────────────────────────────────────────────────
async function loadCurrencies() {
  try {
    const res = await api.getList('Currency', {
      filters: [['enabled', '=', 1]],
      fields: ['name', 'currency_name'],
      order_by: 'name asc',
      limit_page_length: 500,
    })
    currencies.value = res.data || []
  } catch {
    // Fallback: yaygın para birimleri
    currencies.value = [
      { name: 'USD', currency_name: 'US Dollar' },
      { name: 'EUR', currency_name: 'Euro' },
      { name: 'TRY', currency_name: 'Turkish Lira' },
      { name: 'GBP', currency_name: 'British Pound' },
      { name: 'AED', currency_name: 'UAE Dirham' },
      { name: 'SAR', currency_name: 'Saudi Riyal' },
      { name: 'CNY', currency_name: 'Chinese Yuan' },
      { name: 'JPY', currency_name: 'Japanese Yen' },
    ]
  }
}

// ── Seller kategorilerini yükle ───────────────────────────────────────────────
async function loadSellerCategories() {
  try {
    if (auth.isAdmin) {
      // Admin: tüm aktif kategorileri getir
      const res = await api.getList('Seller Category', {
        filters: [['status', '=', 'Active']],
        fields: ['name', 'category_name', 'status'],
        limit_page_length: 200,
      })
      sellerCategories.value = res.data || []
    } else {
      // Satıcı: kendi onaylı kategorileri
      const res = await api.callMethod('tradehub_core.api.seller.get_my_seller_categories')
      const all = res.message?.categories || res.message || []
      sellerCategories.value = all.filter(c => c.status === 'Active')
    }
  } catch {
    sellerCategories.value = []
  }
}

// ── Platform Kategori Cascade Picker ─────────────────────────────────────────
const categoryPickerPath = ref([]) // Seçilen kategorinin tam yolu (breadcrumb gösterimi)

const categoryPicker = ref({
  show: false,
  loading: false,
  items: [],
  path: [], // Navigasyon geçmişi (modal içi breadcrumb)
})

async function openCategoryPicker() {
  categoryPicker.value.show = true
  categoryPicker.value.path = []
  await loadCategoryChildren(null)
}

async function loadCategoryChildren(parentId) {
  categoryPicker.value.loading = true
  try {
    const res = await api.callMethod('tradehub_core.api.category.get_platform_category_tree', {
      parent: parentId || '',
    })
    categoryPicker.value.items = res.message || []
  } catch (err) {
    toast.error('Kategoriler yüklenemedi: ' + (err.message || ''))
    categoryPicker.value.items = []
  } finally {
    categoryPicker.value.loading = false
  }
}

async function drillDown(cat) {
  categoryPicker.value.path.push({ name: cat.name, category_name: cat.category_name })
  await loadCategoryChildren(cat.name)
}

async function categoryPickerGoTo(idx) {
  if (idx === -1) {
    categoryPicker.value.path = []
    await loadCategoryChildren(null)
  } else {
    categoryPicker.value.path = categoryPicker.value.path.slice(0, idx + 1)
    await loadCategoryChildren(categoryPicker.value.path[idx].name)
  }
}

function selectCategoryItem(cat) {
  if (cat.child_count > 0) {
    drillDown(cat)
  } else {
    confirmCategory(cat)
  }
}

function confirmCategory(cat) {
  form.product_category = cat.name
  categoryPickerPath.value = [
    ...categoryPicker.value.path,
    { name: cat.name, category_name: cat.category_name },
  ]
  categoryPicker.value.show = false
}

function clearProductCategory() {
  form.product_category = ''
  categoryPickerPath.value = []
}

async function loadCategoryPath(categoryId) {
  if (!categoryId) { categoryPickerPath.value = []; return }
  try {
    const res = await api.callMethod('tradehub_core.api.category.get_category_ancestors', { name: categoryId })
    categoryPickerPath.value = res.message || []
  } catch {
    categoryPickerPath.value = []
  }
}

// ── Veri yükleme ──────────────────────────────────────────────────────────────
async function loadDoc() {
  if (isNew.value) return

  loading.value = true
  try {
    const res = await api.getDoc('Listing', docName.value)
    const data = res.data || {}
    Object.keys(form).forEach(k => {
      if (data[k] !== undefined) form[k] = data[k]
    })

    // Seçili platform kategorisinin tam yolunu yükle
    if (form.product_category) {
      await loadCategoryPath(form.product_category)
    }

    // Child tablelara doldur (Frappe child tableları parent doc içinde gelir)
    childData.pricing_tiers = (data.pricing_tiers || []).map(clean)
    childData.listing_images = (data.listing_images || []).map(clean)
    childData.attribute_values = (data.attribute_values || []).map(clean)
    childData.variant_items = (data.variant_items || []).map(clean)
    childData.customization_options = (data.customization_options || []).map(clean)
    childData.lead_time_ranges = (data.lead_time_ranges || []).map(clean)
    childData.shipping_methods = (data.shipping_methods || []).map(clean)
  } catch (err) {
    toast.error(err.message || 'Yüklenemedi')
  } finally {
    loading.value = false
  }
}

function clean(row) {
  const { name, parent, parenttype, parentfield, idx, doctype, ...rest } = row
  return { _name: name, ...rest }
}

// Zorunlu alanları boş olan satırları kaydetme
const REQUIRED_KEYS = {
  'Listing Bulk Pricing Tier': ['min_qty', 'price'],
  'Listing Image': ['image'],
  'Listing Attribute Value': ['attribute_name', 'attribute_value'],
  'Listing Variant Item': ['attribute_type', 'attribute_value'],
  'Listing Customization Option': ['option_name'],
  'Listing Lead Time Range': ['min_qty', 'lead_days'],
  'Shipping Method Item': ['shipping_method_name', 'cost'],
}

function prepareChildRows(rows, childDoctype) {
  const requiredKeys = REQUIRED_KEYS[childDoctype] || []
  return rows
    .filter(row => {
      // İlk zorunlu alan boşsa satırı atla
      if (requiredKeys.length === 0) return true
      const firstKey = requiredKeys[0]
      const v = row[firstKey]
      return v !== '' && v !== null && v !== undefined
    })
    .map(row => {
      const { _name, ...rest } = row
      const out = { doctype: childDoctype, ...rest }
      if (_name) out.name = _name
      return out
    })
}

// ── Kaydet ───────────────────────────────────────────────────────────────────
async function saveDoc() {
  if (!form.title) { toast.error('Başlık zorunludur'); return }
  if (!form.currency) { toast.error('Para birimi zorunludur'); return }
  if (!form.base_price) { toast.error('Taban fiyat zorunludur'); return }
  if (!form.selling_price) { toast.error('Satış fiyatı zorunludur'); return }

  saving.value = true
  try {
    const READONLY = ['listing_code', 'supplier_display_name', 'category_name', 'product_category_name', 'reserved_qty', 'available_qty',
      'view_count', 'wishlist_count', 'order_count', 'average_rating', 'review_count', 'erpnext_item', 'published_at', 'creation', 'modified']

    const payload = {}
    Object.keys(form).forEach(k => {
      if (!READONLY.includes(k)) payload[k] = form[k]
    })

    // Satıcı statü değiştiremez (admin-only statüler)
    if (!isAdmin.value && adminOnlyStatuses.includes(payload.status)) {
      delete payload.status
    }

    // Child tables
    payload.pricing_tiers = prepareChildRows(childData.pricing_tiers, 'Listing Bulk Pricing Tier')
    payload.listing_images = prepareChildRows(childData.listing_images, 'Listing Image')
    payload.attribute_values = prepareChildRows(childData.attribute_values, 'Listing Attribute Value')
    payload.variant_items = prepareChildRows(childData.variant_items, 'Listing Variant Item')
    payload.customization_options = prepareChildRows(childData.customization_options, 'Listing Customization Option')
    payload.lead_time_ranges = prepareChildRows(childData.lead_time_ranges, 'Listing Lead Time Range')
    payload.shipping_methods = prepareChildRows(childData.shipping_methods, 'Shipping Method Item')

    if (isNew.value) {
      const res = await api.createDoc('Listing', payload)
      const newName = res.data?.name
      toast.success('Ürün oluşturuldu')
      const returnTo = route.query.returnTo
      if (returnTo) router.push(returnTo)
      else if (newName) router.replace(`/app/Listing/${encodeURIComponent(newName)}?returnTo=/seller-listings`)
    } else {
      await api.updateDoc('Listing', docName.value, payload)
      toast.success('Kaydedildi')
      await loadDoc()
    }
  } catch (err) {
    toast.error(err.message || 'Kayıt hatası')
  } finally {
    saving.value = false
  }
}

// ── Görsel yükleme ────────────────────────────────────────────────────────────
async function uploadImage(fieldName, event) {
  const file = event.target.files?.[0]
  if (!file) return
  uploadingField.value = fieldName
  try {
    const url = await doUpload(file)
    form[fieldName] = url
    toast.success('Görsel yüklendi')
  } catch (err) {
    toast.error(err.message || 'Yükleme hatası')
  } finally {
    uploadingField.value = null
    event.target.value = ''
  }
}

async function addImageRow(event) {
  const file = event.target.files?.[0]
  if (!file) return
  uploadingImageRow.value = true
  try {
    const url = await doUpload(file)
    childData.listing_images.push({ image: url, alt_text: '', sort_order: childData.listing_images.length + 1 })
  } catch (err) {
    toast.error(err.message || 'Yükleme hatası')
  } finally {
    uploadingImageRow.value = false
    event.target.value = ''
  }
}

async function uploadImageRow(idx, event) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const url = await doUpload(file)
    childData.listing_images[idx].image = url
    toast.success('Görsel güncellendi')
  } catch (err) {
    toast.error(err.message || 'Yükleme hatası')
  } finally {
    event.target.value = ''
  }
}

function removeImageRow(idx) {
  childData.listing_images.splice(idx, 1)
}

async function doUpload(file) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('is_private', '0')
  if (!isNew.value) {
    fd.append('doctype', 'Listing')
    fd.append('docname', docName.value)
  }
  const res = await fetch('/api/method/upload_file', {
    method: 'POST',
    headers: {
      'X-Frappe-CSRF-Token': document.cookie.match(/csrf_token=([^;]+)/)?.[1] || 'None',
      'Accept': 'application/json',
    },
    credentials: 'include',
    body: fd,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`)
  return json.message?.file_url || json.message
}

function goBack() {
  const returnTo = route.query.returnTo
  if (returnTo) router.push(returnTo)
  else router.push('/seller-listings')
}

onMounted(() => {
  loadCurrencies()
  loadSellerCategories()
  loadDoc()
})
</script>

<style scoped>
.section-title {
  @apply text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2;
}
</style>
