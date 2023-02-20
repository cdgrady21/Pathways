## Originally R Morgan, 12/21/2021. Adapted C Grady, 9/28/2022.

## # Scrapping the USAID CDCS URLs for each country from 
## # https://www.usaid.gov/results-and-data/planning/country-strategies-cdcs 

# install.packages("")
library(tidyverse)
library(rvest)

the_urls <- read_html("https://www.usaid.gov/results-and-data/planning/country-strategies-cdcs") %>% 
  html_elements(xpath = "//*[@id='node-page-985']/div[1]/div/div/div/div/a") %>% 
  html_attr("href") %>% 
  tibble(cdcs_url = paste0("https://www.usaid.gov", .)) %>% 
  select(cdcs_url)

afg_urls <- read_html("https://www.usaid.gov/results-and-data/planning/country-strategies-cdcs") %>% 
  html_elements(xpath = "//*[@id='node-page-985']/div[1]/div/div/div/p[5]/a") %>% 
  html_attr("href") %>% 
  tibble(cdcs_url = .) %>% 
  select(cdcs_url)
the_urls <- rbind(the_urls, afg_urls)

the_names <- read_html("https://www.usaid.gov/results-and-data/planning/country-strategies-cdcs") %>% 
  html_elements(xpath = "//*[@id='node-page-985']/div[1]/div/div/div/div/a") %>% 
  html_text() %>%
  tibble(country_name = .) %>% 
  select(country_name)

afg_names <- read_html("https://www.usaid.gov/results-and-data/planning/country-strategies-cdcs") %>% 
  html_elements(xpath = "//*[@id='node-page-985']/div[1]/div/div/div/p[5]/a") %>% 
  html_text() %>%
  tibble(country_name = .) %>% 
  select(country_name)
the_names <- rbind(the_names, afg_names)

regionals_tag <- "Regional|Office of|CAM|Central Asia|Eastern and Southern Caribbean"

cdcs_pages_urls <- cbind(the_names, the_urls) %>%
  filter(str_detect(cdcs_url, "/ru/", negate = TRUE)) %>% 
  mutate(regional = ifelse(str_detect(country_name, regionals_tag), 1, 0)) %>% 
  arrange(regional, country_name) 

## # The cdcs_urls take you to the main page. The goal now is to grab all of the links to the pdfs.
## # Unfortunately, the main pages are not up to date.
## # Some of the links to are 404 not found. So, we need to cycle over them to remove the links that are 404

cdcs_urls <- pull(cdcs_pages_urls, cdcs_url) %>% ## # When updating, comment out the link below and adjust each time 
  .[-c(1, 36, 39, 45, 46, 54, 57, 63, 65)] 
## # The AFG, Nicaragua, Paraguay, Somalia, S. Africa, Yemen, AFR bureau, Asia Bureau, W AFR CDCSs are 404 page not found

cdcs_doc_urls <- NULL
for(r in cdcs_urls){ ## # Could use map() but can also be viewed as a DDOS attack... 
  print(r) ## just to check progress and to see where it breaks... 
  cdcs_doc_url <- read_html(r) %>% 
    html_elements(".document-links") %>% 
    as.character(.) %>% 
    str_extract(., "https.*pdf")
  cdcs_doc_urls <- c(cdcs_doc_urls, cdcs_doc_url)
}

if(!dir.exists(here::here("CDCS PDFs"))){
   dir.create(here::here("CDCS PDFs"))
  }

for(k in cdcs_doc_urls){
  file_path <- paste0(here::here("PDFs"), "/", str_extract(k, "([A-Z])\\w.+"))
  download.file(k, destfile = file_path, mode = "wb")
}
