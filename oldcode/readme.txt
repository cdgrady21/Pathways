Two different Jupyter Notebook scripts that will scrape the DEC. 
The "Final_report" is an example of scraping using the "document type" search function. 
The "DRG" script uses the "primary subject" search function. 
These scripts can be adjusted to to use keyword search function in the "Document Title" or "Text of Document" options on the DEC https://dec.usaid.gov/dec/content/AdvancedSearch.aspx?ctID=ODVhZjk4NWQtM2YyMi00YjRmLTkxNjktZTcxMjM2NDBmY2Uy

For the R script to properly download the docs, you need to add , mode = "wb" to the end of the download.file() call

The "text_analysis" folder contains examples of scanning in docs and doing a keyword search.
rfp_mrc_loop.Rmd creates the clean+search function and loops it over all files in a folder.
rfp_testing is looking at a single file to develop the clean + search function.