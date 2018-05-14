install:
	npm install

start:
	npm run babel-node --  src/bin/gendiff

publish:
	npm publish

lint:
	npm run eslint .

.PHONY: install start publish lint
