#!/bin/bash
# Smoke test script — run after deploy
# Usage: SITE_URL=https://ergonomicadesk.com ./scripts/smoke-test.sh

SITE=${SITE_URL:-"http://localhost:8000"}
BACKEND=${BACKEND_URL:-"http://localhost:9000"}
PASS=0
FAIL=0

check() {
  local name="$1"
  local url="$2"
  local expect="$3"

  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
  if [ "$STATUS" = "$expect" ]; then
    echo "  OK $name ($STATUS)"
    PASS=$((PASS + 1))
  else
    echo "  FAIL $name — expected $expect, got $STATUS"
    FAIL=$((FAIL + 1))
  fi
}

echo "Smoke testing $SITE"
echo ""

echo "-- Pages --"
check "Homepage" "$SITE/pa" "200"
check "Store" "$SITE/pa/store" "200"
check "FAQ" "$SITE/pa/faq" "200"
check "Blog" "$SITE/pa/blog" "200"
check "Showroom" "$SITE/pa/showroom" "200"
check "Sitemap" "$SITE/sitemap.xml" "200"
check "Robots" "$SITE/robots.txt" "200"
check "llms.txt" "$SITE/llms.txt" "200"

echo ""
echo "-- PDP --"
check "Product page (frame-single-bl)" "$SITE/pa/productos/frame-single-bl" "200"

echo ""
echo "-- Category --"
check "Category (sillas)" "$SITE/pa/store?category=sillas" "200"

echo ""
echo "-- Cart --"
check "Cart page" "$SITE/pa/cart" "200"

echo ""
echo "-- Health --"
check "Storefront health" "$SITE/api/health" "200"
check "Backend health" "$BACKEND/health" "200"

echo ""
echo "-- Redirects (301) --"
check "Old /categories/desks" "$SITE/categories/desks" "301"
check "Old /products/frame-single-bl" "$SITE/products/frame-single-bl" "301"

echo ""
echo "-- Security Headers --"
HEADERS=$(curl -sI "$SITE/pa" 2>/dev/null)
for H in "x-content-type-options" "x-frame-options" "referrer-policy" "content-security-policy"; do
  if echo "$HEADERS" | grep -qi "$H"; then
    echo "  OK $H present"
    PASS=$((PASS + 1))
  else
    echo "  FAIL $H missing"
    FAIL=$((FAIL + 1))
  fi
done

echo ""
echo "-- noindex on transactional pages --"
CHECKOUT_HTML=$(curl -s "$SITE/pa/checkout" 2>/dev/null)
if echo "$CHECKOUT_HTML" | grep -qi "noindex"; then
  echo "  OK Checkout has noindex"
  PASS=$((PASS + 1))
else
  echo "  FAIL Checkout missing noindex"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "================================"
echo "Results: $PASS passed, $FAIL failed"
echo "================================"

exit $FAIL
