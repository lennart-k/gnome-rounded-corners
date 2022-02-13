UUID=Rounded_Corners@lennart-k

zip: *.js metadata.json corners/* schemas/* README.md LICENSE CREDITS
	rm -rf _build
	mkdir -p _build
	cp *.js _build
	mkdir -p _build/corners
	cp corners/* _build/corners
	mkdir -p _build/schemas
	cp schemas/* _build/schemas
	cp README.md _build/
	cp metadata.json _build/
	cp LICENSE _build/
	cp CREDITS _build/
	cd _build; zip -r "$(UUID).zip" .
	mv "_build/$(UUID).zip" .
	rm -rf _build