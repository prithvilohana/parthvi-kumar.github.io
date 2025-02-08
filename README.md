# 🎶 Echo Music – A Dynamic Music Player  

Echo Music is a lightweight music player built with **HTML, CSS, and JavaScript** that dynamically displays songs **without any hardcoding**. 
Simply drop an album folder (with songs, a cover image, and an `info.json` file) into the directory, and it will automatically appear in the UI.  

## 🚀 Features  
✅ **Auto-Detection** – No need to manually update song lists; new tracks are detected automatically.  
✅ **No Database Required** – Fetches songs directly from the directory.  
✅ **Dynamic UI** – Updates as new songs are added.  
✅ **Minimal & Lightweight** – Built using only HTML, CSS, and JavaScript.  

## 🎯 How It Works  
1. Upload an album folder containing:  
   - Songs
   - A **cover image**  
   - An `info.json` file with metadata  
2. The UI automatically **fetches and displays** new albums & tracks.  

## 🔥 Tech Stack  
- **Frontend:** HTML, CSS, JavaScript  
- **File Handling:** Fetch API to read local files  

## ⚠️ Important Note  
This project is a **learning experiment**. Due to **browser security restrictions**, web apps cannot read local directories directly.
This works only in a **local environment** (e.g., running on a local server). For real-world deployment, a backend (like **Node.js & Express**) would be required.  

## 📌 Future Improvements  
✅ Backend integration (Node.js/Express)  
✅ Cloud storage support (Firebase, AWS S3)  
✅ Playlist & user preferences  

## 📜 License  
This project is open-source. Feel free to modify and use it for learning purposes!  

---
