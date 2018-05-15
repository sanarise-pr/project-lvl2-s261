install:
	npm install

start:
	npm run babel-node --  src/bin/gendiff $(F) $(S)

publish:
	npm publish

lint:
	npm run eslint .

test:
	npm test

.PHONY: install start publish lint
