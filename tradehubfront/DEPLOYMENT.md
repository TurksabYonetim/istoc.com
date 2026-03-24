# GitHub Pages Deployment Rehberi

Bu projeyi GitHub Pages'e deploy etmek için aşağıdaki adımları takip edin.

## 1. GitHub Repository Oluşturma

1. GitHub'da yeni bir repository oluşturun (veya mevcut bir repo kullanın)
2. Repository adını not edin (örnek: `tradehub`)

## 2. Projeyi GitHub'a Push Etme

Eğer henüz git repository'si yoksa:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/tradehub.git
git push -u origin main
```

## 3. GitHub Pages Ayarları

1. GitHub repository'nize gidin
2. **Settings** sekmesine tıklayın
3. Sol menüden **Pages** seçeneğine tıklayın
4. **Source** bölümünde:
   - **Source**: `GitHub Actions` seçin
5. Ayarları kaydedin

## 4. Base Path Ayarlama (Önemli!)

Eğer repository adınız `tradehub` değilse, `vite.config.ts` dosyasındaki base path'i güncelleyin:

```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/REPO_ADINIZ/' : '/',
```

Örneğin, repo adınız `my-tradehub` ise:
```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/my-tradehub/' : '/',
```

## 5. Otomatik Deployment

Artık her `main` veya `master` branch'ine push yaptığınızda:
- GitHub Actions otomatik olarak projeyi build edecek
- Build edilen dosyalar GitHub Pages'e deploy edilecek
- Deployment durumunu **Actions** sekmesinden takip edebilirsiniz

## 6. Site URL'i

Deployment tamamlandıktan sonra siteniz şu adreste olacak:
- `https://KULLANICI_ADI.github.io/tradehub/`

## Manuel Deployment

Eğer manuel olarak deploy etmek isterseniz:

```bash
npm run build
# dist klasöründeki dosyaları GitHub Pages'e yükleyin
```

## Sorun Giderme

### Build hatası alıyorsanız:
- GitHub Actions loglarını kontrol edin
- `package.json` ve `package-lock.json` dosyalarının commit edildiğinden emin olun

### Sayfa bulunamıyor hatası:
- `vite.config.ts` dosyasındaki base path'in doğru olduğundan emin olun
- Repository adı ile base path'in eşleştiğinden emin olun

### CSS/JS dosyaları yüklenmiyor:
- Base path ayarını kontrol edin
- Browser console'da hata mesajlarını kontrol edin

