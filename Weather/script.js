  

  // elements 
  const cityInput   = document.getElementById('cityInput');
  const suggestBox  = document.getElementById('suggestions');
  const locateBtn   = document.getElementById('locateBtn');
  const scene       = document.getElementById('scene');
  const rainLayer   = document.getElementById('rainLayer');
  const readout     = document.getElementById('readout');
  const stateMsg    = document.getElementById('stateMsg');

  let debounceTimer = null;
  let activeSuggestionIndex = -1;
  let currentSuggestions = [];

 
  for (let i = 0; i < 26; i++) {
    const drop = document.createElement('div');
    drop.className = 'drop';
    drop.style.left = (Math.random() * 100) + '%';
    drop.style.animationDelay = (Math.random() * 0.9) + 's';
    drop.style.height = (10 + Math.random() * 10) + 'px';
    rainLayer.appendChild(drop);
  }


  cityInput.addEventListener('input', () => {
    const query = cityInput.value.trim();
    activeSuggestionIndex = -1;

    if (debounceTimer) clearTimeout(debounceTimer);

    if (query.length === 0) {
      hideSuggestions();
      return;
    }

  
    debounceTimer = setTimeout(() => searchCities(query), 250);
  });

  cityInput.addEventListener('keydown', (e) => {
    if (!suggestBox.classList.contains('show')) return;
    const items = suggestBox.querySelectorAll('.suggestion-item');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, items.length - 1);
      highlightActive(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, 0);
      highlightActive(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && currentSuggestions[activeSuggestionIndex]) {
        pickCity(currentSuggestions[activeSuggestionIndex]);
      } else if (currentSuggestions[0]) {
        pickCity(currentSuggestions[0]);
      }
    } else if (e.key === 'Escape') {
      hideSuggestions();
    }
  });

  document.addEventListener('click', (e) => {
    if (!suggestBox.contains(e.target) && e.target !== cityInput) {
      hideSuggestions();
    }
  });

  function highlightActive(items) {
    items.forEach((item, i) => item.classList.toggle('active', i === activeSuggestionIndex));
  }


  const INDIAN_CITIES = [
    ['Mumbai','Maharashtra',19.0760,72.8777,12442373],
    ['Delhi','Delhi',28.7041,77.1025,11034555],
    ['Bengaluru','Karnataka',12.9716,77.5946,8443675],
    ['Hyderabad','Telangana',17.3850,78.4867,6993262],
    ['Ahmedabad','Gujarat',23.0225,72.5714,5570585],
    ['Chennai','Tamil Nadu',13.0827,80.2707,4646732],
    ['Kolkata','West Bengal',22.5726,88.3639,4496694],
    ['Surat','Gujarat',21.1702,72.8311,4467797],
    ['Pune','Maharashtra',18.5204,73.8567,3124458],
    ['Jaipur','Rajasthan',26.9124,75.7873,3046163],
    ['Lucknow','Uttar Pradesh',26.8467,80.9462,2817105],
    ['Kanpur','Uttar Pradesh',26.4499,80.3319,2767031],
    ['Nagpur','Maharashtra',21.1458,79.0882,2405421],
    ['Indore','Madhya Pradesh',22.7196,75.8577,1994397],
    ['Thane','Maharashtra',19.2183,72.9781,1841488],
    ['Bhopal','Madhya Pradesh',23.2599,77.4126,1798218],
    ['Visakhapatnam','Andhra Pradesh',17.6868,83.2185,1730320],
    ['Pimpri-Chinchwad','Maharashtra',18.6298,73.7997,1727692],
    ['Patna','Bihar',25.5941,85.1376,1684222],
    ['Vadodara','Gujarat',22.3072,73.1812,1666703],
    ['Ghaziabad','Uttar Pradesh',28.6692,77.4538,1648643],
    ['Ludhiana','Punjab',30.9010,75.8573,1618879],
    ['Agra','Uttar Pradesh',27.1767,78.0081,1585704],
    ['Nashik','Maharashtra',19.9975,73.7898,1486973],
    ['Faridabad','Haryana',28.4089,77.3178,1414050],
    ['Meerut','Uttar Pradesh',28.9845,77.7064,1305429],
    ['Rajkot','Gujarat',22.3039,70.8022,1286995],
    ['Kalyan-Dombivli','Maharashtra',19.2403,73.1305,1246381],
    ['Vasai-Virar','Maharashtra',19.4259,72.8225,1221233],
    ['Varanasi','Uttar Pradesh',25.3176,82.9739,1198491],
    ['Srinagar','Jammu and Kashmir',34.0837,74.7973,1192792],
    ['Aurangabad','Maharashtra',19.8762,75.3433,1175116],
    ['Dhanbad','Jharkhand',23.7957,86.4304,1162472],
    ['Amritsar','Punjab',31.6340,74.8723,1132761],
    ['Navi Mumbai','Maharashtra',19.0330,73.0297,1119477],
    ['Allahabad','Uttar Pradesh',25.4358,81.8463,1117094],
    ['Ranchi','Jharkhand',23.3441,85.3096,1073427],
    ['Howrah','West Bengal',22.5958,88.2636,1072161],
    ['Coimbatore','Tamil Nadu',11.0168,76.9558,1061447],
    ['Jabalpur','Madhya Pradesh',23.1815,79.9864,1055525],
    ['Gwalior','Madhya Pradesh',26.2183,78.1828,1054420],
    ['Vijayawada','Andhra Pradesh',16.5062,80.6480,1048240],
    ['Jodhpur','Rajasthan',26.2389,73.0243,1033918],
    ['Madurai','Tamil Nadu',9.9252,78.1198,1017865],
    ['Raipur','Chhattisgarh',21.2514,81.6296,1010087],
    ['Kota','Rajasthan',25.2138,75.8648,1001365],
    ['Chandigarh','Chandigarh',30.7333,76.7794,960787],
    ['Guwahati','Assam',26.1445,91.7362,957352],
    ['Solapur','Maharashtra',17.6599,75.9064,951558],
    ['Hubli-Dharwad','Karnataka',15.3647,75.1240,943857],
    ['Mysore','Karnataka',12.2958,76.6394,920550],
    ['Tiruchirappalli','Tamil Nadu',10.7905,78.7047,916857],
    ['Bareilly','Uttar Pradesh',28.3670,79.4304,903668],
    ['Aligarh','Uttar Pradesh',27.8974,78.0880,874408],
    ['Tiruppur','Tamil Nadu',11.1085,77.3411,877778],
    ['Moradabad','Uttar Pradesh',28.8389,78.7768,889810],
    ['Jalandhar','Punjab',31.3260,75.5762,873725],
    ['Bhubaneswar','Odisha',20.2961,85.8245,837737],
    ['Salem','Tamil Nadu',11.6643,78.1460,831038],
    ['Warangal','Telangana',17.9689,79.5941,811844],
    ['Guntur','Andhra Pradesh',16.3067,80.4365,743354],
    ['Bhiwandi','Maharashtra',19.3002,73.0629,709012],
    ['Saharanpur','Uttar Pradesh',29.9680,77.5460,705478],
    ['Gorakhpur','Uttar Pradesh',26.7606,83.3732,673446],
    ['Bikaner','Rajasthan',28.0229,73.3119,647804],
    ['Amravati','Maharashtra',20.9374,77.7796,647057],
    ['Noida','Uttar Pradesh',28.5355,77.3910,642381],
    ['Jamshedpur','Jharkhand',22.8046,86.2029,629659],
    ['Bhilai','Chhattisgarh',21.1938,81.3509,625697],
    ['Cuttack','Odisha',20.4625,85.8830,606007],
    ['Kochi','Kerala',9.9312,76.2673,601574],
    ['Bhavnagar','Gujarat',21.7645,72.1519,605882],
    ['Dehradun','Uttarakhand',30.3165,78.0322,578420],
    ['Durgapur','West Bengal',23.5204,87.3119,581409],
    ['Asansol','West Bengal',23.6739,86.9524,564491],
    ['Nanded','Maharashtra',19.1383,77.3210,550564],
    ['Kolhapur','Maharashtra',16.7050,74.2433,549236],
    ['Ajmer','Rajasthan',26.4499,74.6399,542580],
    ['Gulbarga','Karnataka',17.3297,76.8343,543147],
    ['Jamnagar','Gujarat',22.4707,70.0577,529308],
    ['Ujjain','Madhya Pradesh',23.1765,75.7885,515215],
    ['Siliguri','West Bengal',26.7271,88.3953,513264],
    ['Jhansi','Uttar Pradesh',25.4484,78.5685,507100],
    ['Thiruvananthapuram','Kerala',8.5241,76.9366,460468],
    ['Shimla','Himachal Pradesh',31.1048,77.1734,169578],
    ['Panaji','Goa',15.4909,73.8278,114759],
    ['Puducherry','Puducherry',11.9416,79.8083,244377],
    ['Gandhinagar','Gujarat',23.2156,72.6369,292797],
    ['Itanagar','Arunachal Pradesh',27.0844,93.6053,59490],
    ['Imphal','Manipur',24.8170,93.9368,264986],
    ['Shillong','Meghalaya',25.5788,91.8933,143229],
    ['Aizawl','Mizoram',23.7271,92.7176,293416],
    ['Kohima','Nagaland',25.6751,94.1086,99039],
    ['Agartala','Tripura',23.8315,91.2868,522613]
  ].map(([name, admin1, latitude, longitude, population]) => ({
    name, admin1, country: 'India', country_code: 'IN', latitude, longitude, population
  }));


 
  function searchLocalIndianCities(query) {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return [];
    return INDIAN_CITIES.filter((city) => city.name.toLowerCase().startsWith(q));
  }

  async function searchCities(query) {
    const localMatches = searchLocalIndianCities(query);

    try {
  
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=15&language=en&format=json`;
      const res = await fetch(url);
      const data = await res.json();

      const apiResults = data.results || [];
      const merged = mergeResults(localMatches, apiResults);
      currentSuggestions = rankIndiaFirst(merged).slice(0, 8);
      renderSuggestions(currentSuggestions);
    } catch (err) {
      // API call failed (offline, blocked, rate limited) — fall back to
      // local matches only, so search still works for major Indian cities
      if (localMatches.length > 0) {
        currentSuggestions = localMatches.slice(0, 8);
        renderSuggestions(currentSuggestions);
      } else {
        hideSuggestions();
      }
    }
  }

  function mergeResults(localMatches, apiResults) {
    const seen = new Set();
    const combined = [];

    [...localMatches, ...apiResults].forEach((place) => {
      const key = (place.name + '|' + place.country_code).toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(place);
      }
    });

    return combined;
  }

 
  function rankIndiaFirst(results) {
    const isIndia = (place) => place.country_code === 'IN';

    return results.slice().sort((a, b) => {
      const aIndia = isIndia(a) ? 1 : 0;
      const bIndia = isIndia(b) ? 1 : 0;
      if (aIndia !== bIndia) return bIndia - aIndia;

      const aPop = a.population || 0;
      const bPop = b.population || 0;
      return bPop - aPop;
    });
  }

  function renderSuggestions(results) {
    if (results.length === 0) {
      suggestBox.innerHTML = '<div class="suggestion-empty">No matching cities</div>';
      suggestBox.classList.add('show');
      return;
    }

    suggestBox.innerHTML = '';
    results.forEach((place, i) => {
      const row = document.createElement('div');
      row.className = 'suggestion-item';

      const region = [place.admin1, place.country].filter(Boolean).join(', ');
      row.innerHTML = `
        <span class="suggestion-name">${escapeHtml(place.name)}</span>
        <span class="suggestion-region">${escapeHtml(region)}</span>
      `;

      row.addEventListener('click', () => pickCity(place));
      suggestBox.appendChild(row);
    });

    suggestBox.classList.add('show');
  }

  function hideSuggestions() {
    suggestBox.classList.remove('show');
    suggestBox.innerHTML = '';
  }

  function pickCity(place) {
    cityInput.value = place.name;
    hideSuggestions();
    loadWeather(place.latitude, place.longitude, place.name, [place.admin1, place.country].filter(Boolean).join(', '));
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
  function detectLocation(onFound, onGiveUp, opts) {
    if (!('geolocation' in navigator) || window.isSecureContext === false) {
      onGiveUp('Location lookup needs a secure (https) connection and browser support. Search for your city instead.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => onFound(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        const messages = {
          [err.PERMISSION_DENIED]: 'Location permission was denied — allow location for this page and try again.',
          [err.POSITION_UNAVAILABLE]: 'Position unavailable right now. Make sure location services are turned on.',
          [err.TIMEOUT]: 'The request timed out — try again.'
        };
        onGiveUp(messages[err.code] || 'Could not get your location. Search for your city instead.');
      },
      opts
    );
  }

  locateBtn.addEventListener('click', () => {
    locateBtn.classList.add('loading');
    detectLocation(
      (lat, lon) => { locateBtn.classList.remove('loading'); reverseGeocode(lat, lon); },
      (msg) => { locateBtn.classList.remove('loading'); showState(msg, true); },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  });

  
  
  async function reverseGeocode(lat, lon) {
    try {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
      const res = await fetch(url);
      const data = await res.json();
      const name = data.city || data.locality;
      if (name) {
        const sub = [data.principalSubdivision, data.countryName].filter(Boolean).join(', ');
        loadWeather(lat, lon, name, sub);
        return;
      }
    } catch (err) {
      
    }
    const nearest = nearestIndianCity(lat, lon);
    const name = nearest ? nearest.name : 'Your area';
    const sub = nearest ? [nearest.admin1, nearest.country].filter(Boolean).join(', ') : '';
    loadWeather(lat, lon, name, sub);
  }
  function distanceKm(lat1, lon1, lat2, lon2) {
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(a));
  }

  function nearestIndianCity(lat, lon) {
    return INDIAN_CITIES.reduce((closest, city) => {
      const d = distanceKm(lat, lon, city.latitude, city.longitude);
      return (!closest || d < closest.d) ? { ...city, d } : closest;
    }, null);
  }

  //  weather fetch 
  async function loadWeather(lat, lon, name, sub) {
    showState('Loading weather…', false);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('bad response');
      const data = await res.json();

      renderWeather(data.current, name, sub);
    } catch (err) {
      showState('Could not load weather right now. Check your connection and try again.', true);
    }
  }

  function renderWeather(current, name, sub) {
    hideState();
    readout.classList.remove('hidden');

    document.getElementById('placeName').textContent = name;
    document.getElementById('placeSub').textContent = sub || ' ';
    document.getElementById('tempValue').textContent = Math.round(current.temperature_2m);
    document.getElementById('statFeels').textContent = Math.round(current.apparent_temperature) + '°';
    document.getElementById('statHumidity').textContent = Math.round(current.relative_humidity_2m) + '%';
    document.getElementById('statWind').textContent = Math.round(current.wind_speed_10m) + ' km/h';

    const { label, mood } = describeWeather(current.weather_code, current.is_day);
    document.getElementById('conditionText').textContent = label;
    applyScene(mood);
  }

 
  function describeWeather(code, isDay) {
    const day = isDay === 1;

    if (code === 0) return { label: day ? 'Clear sky' : 'Clear night', mood: day ? 'sunny' : 'night' };
    if (code === 1 || code === 2) return { label: day ? 'Partly cloudy' : 'Partly cloudy night', mood: day ? 'sunny' : 'night' };
    if (code === 3) return { label: 'Overcast', mood: 'cloudy' };
    if (code === 45 || code === 48) return { label: 'Foggy', mood: 'cloudy' };
    if (code >= 51 && code <= 57) return { label: 'Light drizzle', mood: 'rainy' };
    if (code >= 61 && code <= 67) return { label: 'Rain', mood: 'rainy' };
    if (code >= 71 && code <= 77) return { label: 'Snow', mood: 'cloudy' };
    if (code >= 80 && code <= 82) return { label: 'Rain showers', mood: 'rainy' };
    if (code >= 85 && code <= 86) return { label: 'Snow showers', mood: 'cloudy' };
    if (code >= 95) return { label: 'Thunderstorm', mood: 'rainy' };

    return { label: 'Weather unavailable', mood: 'cloudy' };
  }

  function applyScene(mood) {
    scene.classList.remove('sunny', 'cloudy', 'rainy', 'night');
    scene.classList.add(mood);
  }

  //  state messages 
  function showState(text, isError) {
    readout.classList.add('hidden');
    stateMsg.textContent = text;
    stateMsg.classList.toggle('error', !!isError);
    stateMsg.classList.remove('hidden');
  }

  function hideState() {
    stateMsg.classList.add('hidden');
  }


  window.addEventListener('load', () => {
    showState('Detecting your location…', false);
    detectLocation(
      reverseGeocode,
      () => loadWeather(28.6139, 77.2090, 'New Delhi', 'India'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  });

