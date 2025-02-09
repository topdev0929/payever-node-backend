#!/usr/bin/env bash
set -e

#FILES="features/tests/api/*"
#for f in $FILES
#do
#  ./node_modules/.bin/cucumber-js $f
#done


find features/tests -name '*.feature' | xargs -i sh -c './node_modules/.bin/cucumber-js {}'

#./node_modules/.bin/cucumber-js features/tests/api
#sleep 1
#./node_modules/.bin/cucumber-js features/tests/billing-subscription
#sleep 1
#./node_modules/.bin/cucumber-js features/tests/bus
#sleep 1
#./node_modules/.bin/cucumber-js features/tests/channel-set
#sleep 1
#./node_modules/.bin/cucumber-js features/tests/folder
#sleep 1
#./node_modules/.bin/cucumber-js features/tests/graphql
#sleep 1
#./node_modules/.bin/cucumber-js features/tests/import
#sleep 1
#./node_modules/.bin/cucumber-js features/tests/sample-products
#sleep 1
#./node_modules/.bin/cucumber-js features/tests/itworks.features
