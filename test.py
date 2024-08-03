from bs4 import BeautifulSoup
from urllib.request import urlopen

url = 'https://rvist.ac.ke/'
page = urlopen(url)
html = page.read().decode('utf-8')
soup = BeautifulSoup(html, "html.parser")
print(html)
print(soup.get_text())
print(soup.title.string)