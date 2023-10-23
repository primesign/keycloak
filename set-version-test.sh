NEW_VERSION=$1
sed -i 's/keycloak-999.0.0-SNAPSHOT/keycloak-'$NEW_VERSION'/g' .github/workflows/js-ci.yml