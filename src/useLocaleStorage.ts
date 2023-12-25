// custom hook
import { useEffect, useState } from "react";

export function useLocaleStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    // localStorage'dan verileri al
    const jsonValue = localStorage.getItem(key);
    if (jsonValue === null) {
      // localStorage'da veri yoksa başlangıç değerini belirle
      if (typeof initialValue === "function") {
        // Eğer başlangıç değeri bir fonksiyon ise fonksiyonun sonucunu kullan
        return (initialValue as () => T)();
      } else {
        return initialValue;
      }
    } else {
      try {
        // localStorage'da veri varsa JSON ayrıştırma işlemi yap
        return JSON.parse(jsonValue);
      } catch (error) {
        // JSON ayrıştırma hatası olursa, başlangıç değerini kullan
        console.error(`Error parsing JSON for key ${key}:`, error);
        return typeof initialValue === "function"
          ? (initialValue as () => T)()
          : initialValue;
      }
    }
  });

  // Değişen value'yu localStorage'e kaydet
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // Dönecek fonksiyonu ve değeri belirle
  return [value, setValue] as const;
}
