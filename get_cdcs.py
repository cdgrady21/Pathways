import requests
import os
from bs4 import BeautifulSoup


#
#   Python script to scrape CDCS documents from usaid.gov
#   This script uses bs4. You may need to install bs4:
#       pip install bs4
#
# Wrapper to get the text content (html) from a page
def get_html(link):
    link = check_link(link)
    print(link)
    res = requests.get(link)
    txt = res.text
    res.close()
    return txt

# Wrapper to get the content from a page
def get_content(link):
    link = check_link(link)
    print(link)
    res = requests.get(link)
    content = res.content
    res.close()
    return content
    
# Check if a link contains '/' (located on host domain)
def check_link(link):
    if link[0] == '/':
        return 'https://www.usaid.gov'  + link
    else:
        return link
    

# Get webpage
soup = BeautifulSoup(get_html('https://www.usaid.gov/results-and-data/planning/country-strategies-cdcs'), 'html.parser')

# Make a directory to store
if not os.path.exists("CDCS"):
    os.mkdir("CDCS")
os.chdir("CDCS")

# Obtain links to pdfs located on main site
# soup.select uses a CSS selector to obtain the link
pages = {}
for link in soup.select('div[class*="wysiwyg"] > a:first-child'):
    # Try to go to the link referenced
    # Access subpage and search for pdf
    child = BeautifulSoup(get_html(link.get("href")), 'html.parser')
    pdf_attr = child.select('a[href*="pdf"]')

    # Error
    if not pdf_attr:
        #print(link.text + " not found")
        pages[link.text] = "Not found"
        continue
    
    # Visit pdf link
    # Handle multiple links
    pdf_link = pdf_attr[0].get("href")
    if len(pdf_attr) > 1:
        for lnk in pdf_attr:
            # Language edgecase. Not comprehensive. TODO?
            if "title" in lnk.attrs and "Español" in lnk["title"]:
                continue
        
            if "class" in lnk.attrs and "usaid-link" in lnk["class"]:
                pdf_link = lnk.get("href")
        
    # Check if file exists
    if os.path.isfile(link.text + " CDCS.pdf"):
        pages[link.text] = pdf_link
        continue

    # Write
    pdf = open(link.text + " CDCS.pdf", "wb")
    pdf.write(get_content(pdf_link))
    pdf.close()
    
    pages[link.text] = pdf_link


# Display dictionary
print("\nPages Results")
print("====================================================================")
for x in enumerate(pages):
    print("%d:\t%24s\t%s" % (x[0] + 1, x[1][:20], check_link(pages[x[1]])))
        