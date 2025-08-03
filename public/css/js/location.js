function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Fill hidden fields for backend
      document.getElementById('latitude').value = lat;
      document.getElementById('longitude').value = lng;

      alert("📍 Location added successfully!");
    }, () => {
      alert("❌ Location access denied.");
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

  navigator.geolocation.getCurrentPosition(pos => {
    document.getElementById('lat').value = pos.coords.latitude;
    document.getElementById('lng').value = pos.coords.longitude;
  });