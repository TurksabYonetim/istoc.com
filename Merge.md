● Adim Adim Birlestirme

  1. Tum branch'leri master'a merge et

  Her gelistirici kendi branch'ini push eder. Sonra sirayla master'a merge edilir. JSON conflict cikarsa manuel cozulur.

  2. Docker ortamini master branch ile ayaga kaldir

  Master branch'e gecildikten sonra container'lar rebuild edilir.

  3. bench migrate calistir

  docker compose exec backend bench --site tradehub.localhost migrate

  Bu komut:
  - 3 branch'ten gelen tum DocType JSON degisikliklerini okur
  - Veritabanindaki tablolari JSON'lara gore gunceller (yeni field, yeni tablo vb.)
  - Mevcut veriler korunur, sadece yapi degisir

  4. Test et

  Siteyi ac, kayit ol, form doldur — yeni field'lar calisiyor mu, veri dogru kaydediliyor mu kontrol et.

  Tek cumle ozet

  Kod merge edilir → container rebuild edilir → bench migrate calistirilir → bitti. Frappe gerisini otomatik halleder.