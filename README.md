# 📱 GetLokalApp - React Native Assessment

This is a **React Native** application built using **Expo**, created as part of an assessment. The goal is to develop a cross-platform (Android & iOS) app that fetches jobs data and allows bookmarking for offline access.

## 🚀 Features

- 🔁 **Bottom Navigation** with two sections: `Jobs` and `Bookmarks`
- 🌐 **Jobs Screen**: 
  - Fetches job listings from [Jobs API](https://testapi.getlokalapp.com/common/jobs?page=1)
  - Infinite scroll with fast rendering using `FlashList`
  - Displays Title, Location, Salary, and Phone
- 📄 **Job Detail Screen**: Tapping on a job opens a detailed view
- 📌 **Bookmark Functionality**: 
  - Users can bookmark jobs
  - Bookmarked jobs appear under `Bookmarks` tab
  - Stored offline using `expo-sqlite` for persistence
- 📶 Fully handles states: `Loading`, `Error`, `Empty`, `Data`

## 🖌 UI/UX & Libraries

- ⚙️ UI optimized with **gradients** and **expo icons**
- ⚡️ Fast list rendering via **FlashList** from `@shopify/flash-list`
- 🗄 Offline DB using **expo-sqlite** for storing bookmarks

## 🛠 Installation

```bash
git clone https://github.com/thumuvivek2003/lokal-jobs-app.git
cd lokal-jobs-app
npm install
npm run start
