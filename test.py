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
            
            page_courses = urlopen(course_category_url)
            html_courses = page_courses.read().decode('utf-8')
            soup_courses = BeautifulSoup(html_courses, 'html.parser')

            #get courses
            courses_title_tag = soup_courses.find('h1', class_='entry-title')

            if courses_title_tag:
                course_title = courses_title_tag.text.strip()
                print(f"Course Title: {course_title}")

            #get courses list in div tags
            courses_list = soup_courses.find_all('div', class_='wp-block-file') 
            for div in courses_list:
                course_name = div.find('a').text.strip()

                #get download link
                course_info_download_link = div.find('a', class_='wp-block-file__button')['href']

                print(f"course Name: {course_name}")
                print(f"Download Link: {course_info_download_link}")
