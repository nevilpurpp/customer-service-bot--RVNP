from bs4 import BeautifulSoup
from urllib.request import urlopen

url = 'https://rvist.ac.ke/'
page = urlopen(url)
html = page.read().decode('utf-8')
soup = BeautifulSoup(html, 'html.parser')

# Extracting course requirements
courses_section = soup.find('li', id ='menu-item-1637')  
if courses_section:
    #get main menulink
    main_menu_link = courses_section.find('a')
    main_menu_title = main_menu_link.text.strip()
    main_menu_url = main_menu_link['href']
    print(f"Main menu: {main_menu_title}, URL: {main_menu_url}")

    #access submenu
    sub_menu_items = courses_section.find('ul', class_='sub-menu')
    
    if sub_menu_items:
        #get course category
        course_category_links = sub_menu_items.find_all('a')

        for link in course_category_links:
            course_category_title = link.text.strip()
            course_category_url = link['href']
            print(f"Sub menu links: {course_category_title}, \n URL: {course_category_url}")

