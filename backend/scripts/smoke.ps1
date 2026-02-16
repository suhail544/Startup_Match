$API = 'http://localhost:3000/api'
function js($o){ $o | ConvertTo-Json -Depth 6 }

Write-Host '--- SIGNUP ENTREPRENEUR ---'
$entSignup = Invoke-RestMethod -Uri "$API/auth/signup" -Method Post -Body (ConvertTo-Json @{name='Smoke Entrepreneur'; email='ent+smoke@example.com'; password='password123'; role='ENTREPRENEUR'}) -ContentType 'application/json' -ErrorAction Stop
Write-Host (js $entSignup)
$entToken = $entSignup.token

Write-Host '--- CREATE ENTREPRENEUR PROFILE ---'
$entProfile = Invoke-RestMethod -Uri "$API/entrepreneur" -Method Post -Headers @{Authorization="Bearer $entToken"} -Body (ConvertTo-Json @{bio='Smoke test bio'; location='Chennai'}) -ContentType 'application/json' -ErrorAction Stop
Write-Host (js $entProfile)

Write-Host '--- CREATE IDEA ---'
$idea = Invoke-RestMethod -Uri "$API/idea" -Method Post -Headers @{Authorization="Bearer $entToken"} -Body (ConvertTo-Json @{businessName='Smoke Idea'; shortDescription='Smoke test'; fullDescription='Detailed smoke test'; problemStatement='N/A'; solution='N/A'; targetMarket='Test'; businessModel='Test'; fundingRequired=10000; category='Tech'; location='Chennai'; status='ACTIVE'}) -ContentType 'application/json' -ErrorAction Stop
Write-Host (js $idea)
$ideaId = $idea.data.id
Write-Host ('Idea id: ' + $ideaId)

Write-Host '--- SIGNUP INVESTOR ---'
$invSignup = Invoke-RestMethod -Uri "$API/auth/signup" -Method Post -Body (ConvertTo-Json @{name='Smoke Investor'; email='inv+smoke@example.com'; password='password123'; role='INVESTOR'}) -ContentType 'application/json' -ErrorAction Stop
Write-Host (js $invSignup)
$invToken = $invSignup.token

Write-Host '--- CREATE INVESTOR PROFILE ---'
$invProfile = Invoke-RestMethod -Uri "$API/investor" -Method Post -Headers @{Authorization="Bearer $invToken"} -Body (ConvertTo-Json @{companyName='Smoke VC'; investmentRange='$10K-$50K'; focusAreas='Tech'}) -ContentType 'application/json' -ErrorAction Stop
Write-Host (js $invProfile)

Write-Host '--- SAVE IDEA AS INVESTOR ---'
$save = Invoke-RestMethod -Uri "$API/save-idea" -Method Post -Headers @{Authorization="Bearer $invToken"} -Body (ConvertTo-Json @{ideaId=$ideaId}) -ContentType 'application/json' -ErrorAction Stop
Write-Host (js $save)

Write-Host '--- GET SAVED IDEAS ---'
$savedList = Invoke-RestMethod -Uri "$API/save-idea" -Method Get -Headers @{Authorization="Bearer $invToken"} -ErrorAction Stop
Write-Host (js $savedList)

Write-Host '--- GET /entrepreneur/me ---'
$me = Invoke-RestMethod -Uri "$API/entrepreneur/me" -Method Get -Headers @{Authorization="Bearer $entToken"} -ErrorAction Stop
Write-Host (js $me)

Write-Host '--- SMOKE TEST COMPLETE ---'
