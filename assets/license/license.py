import requests
from bs4 import BeautifulSoup

# Lista delle licenze Creative Commons e i loro URL
licenses = {
    "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/legalcode.txt",
    "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-nd/4.0/legalcode.txt",
    "CC BY-ND 4.0": "https://creativecommons.org/licenses/by-nd/4.0/legalcode.txt",
    "CC BY-NC 4.0": "https://creativecommons.org/licenses/by-nc/4.0/legalcode.txt",
    "CC BY-NC-SA 4.0": "https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.txt",
    "CC BY-NC-ND 4.0": "https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode.txt",
    "CC0 1.0": "https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt",
}

# Scarica e salva i testi delle licenze in formato .txt
for name, url in licenses.items():
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Estrai il testo ignorando la struttura HTML
    text = soup.get_text()
    
    # Salva il testo in un file .txt
    file_name = f"{name.replace(' ', '_').replace('(', '').replace(')', '')}.txt"
    with open(file_name, 'w', encoding='utf-8') as file:
        file.write(text.strip())
    
    print(f"Downloaded and saved {name} as {file_name}")

print("All licenses downloaded successfully.")
