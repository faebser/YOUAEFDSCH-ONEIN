PHONY: all clean
	
all: build-ff build-chrome

build-ff: src/youafdsch.js manifest.json icons/logo_48.png
	./node_modules/web-ext/bin/web-ext build

build-chrome: src/youafdsch.js manifest.json icons/logo_48.png bin
	zip -r9 bin/chrome src/youafdsch.js manifest.json icons/logo_48.png

bin:
	mkdir bin/

clean:
	rm -r bin/
	rm -r web-ext-artifacts