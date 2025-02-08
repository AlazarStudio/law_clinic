import React, { useEffect, useState } from "react";
import classes from './InstallButton.module.css';

function InstallButton({ children, ...props }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const beforeInstallPromptHandler = (e) => {
      // Останавливаем браузер от немедленного отображения диалога
      e.preventDefault();
      // Сохраняем событие, чтобы можно было вызвать его позже
      setDeferredPrompt(e);
      // Показываем кнопку установки
      setIsVisible(true);
    };

    // Слушаем событие beforeinstallprompt
    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);

    // Очищаем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Показываем диалог установки
      deferredPrompt.prompt();
      // Ждем, пока пользователь сделает выбор
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User choice: ${outcome}`);
      // Скрываем кнопку после использования
      setIsVisible(false);
      // Очищаем сохраненное событие
      setDeferredPrompt(null);
    }
  };

  if (!isVisible) {
    return null; // Если кнопка не должна отображаться, ничего не рендерим
  }

  return (
    <button onClick={handleInstallClick} style={buttonStyle}>
      <img src="/download.png" alt="" style={buttonStyleImg} />
    </button>
  );
}

const buttonStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50px',
  backgroundColor: '#4CAF50',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '10px',
  border: 'none',
  position: 'absolute',
  bottom: '20px',
  right: '20px',
};

const buttonStyleImg = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

export default InstallButton;