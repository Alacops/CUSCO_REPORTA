from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time

def iniciar_chrome():
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--log-level=3")
    options.add_argument("--headless=new")

    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=options)

def buscar_dni(dni: str):
    driver = iniciar_chrome()
    wait = WebDriverWait(driver, 20)

    try:
        driver.get("https://eldni.com/pe/buscar-datos-por-dni")

        input_dni = wait.until(
            EC.presence_of_element_located((By.ID, "dni"))
        )
        input_dni.send_keys(dni)

        btn = wait.until(
            EC.element_to_be_clickable((By.ID, "btn-buscar-datos-por-dni"))
        )
        btn.click()

        resultado = wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "div.text-center samp.inline-block")
            )
        )

        nombre = resultado.text.strip()

        return {
            "dni": dni,
            "nombre_completo": nombre
        }

    except TimeoutException:
        return {
            "dni": dni,
            "error": "DNI no encontrado"
        }
    finally:
        driver.quit()
