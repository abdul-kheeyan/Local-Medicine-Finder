window.onload = () => {
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) searchBtn.disabled = true;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      document.getElementById('lat').value = pos.coords.latitude;
      document.getElementById('lng').value = pos.coords.longitude;
      if (searchBtn) searchBtn.disabled = false;
    }, () => {
      alert("❌ Location permission denied.");
    });
  } else {
    alert("❌ Geolocation not supported.");
  }
};
