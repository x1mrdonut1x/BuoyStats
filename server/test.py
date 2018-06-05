with open("D:\OneDrive\Documents\Projects\DublinBayBuoy\server\env\Lib\site-packages\httplib2\__init__.py") as fp:
    for i, line in enumerate(fp):
        if "\xe2" in line:
            print i, repr(line)