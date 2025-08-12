# 反切計算器

## 項目簡介

**反切計算器**是一個中古漢語音韻學工具，根據上下字的音韻地位計算被切字的語音。它將反切邏輯可視化、系統化，提供即時反切推導與現代音擬測。設計目標是精確重現中古漢語反切規則，並將其轉化為現代語音學視角下的互動模型。

## 功能

* 根據輸入的上下字，自動解析其音韻地位
* 應用正規反切規則，推導出被切字的音韻地位
* 提供對應現代音（可為拼音、IPA 或其他音系表示）
* 顯示詳細計算過程與邏輯說明，適用於教學與研究
* 多候選處理機制，允許使用者從多種音韻地位中選擇
* 美觀、互動式使用者介面，支援桌面與行動裝置

## 目的

本項目旨在提供一套可操作、可視化、準確重現中古漢語反切制度的工具。作為語音學與漢語歷史語言學研究的輔助平台，它同時適用於學術研究、語言教學以及語音學愛好者的深入學習。

本項目希望解決當代語音研究中對中古漢語反切規則理解不明確、難以操作、缺乏數位工具的問題。

## 製作方法 

本工具基於 [nk2028](https://github.com/nk2028) 的 Tshet-Uinh 系列專案製作，其中包含中古漢語音韻地位資料、反切規則處理邏輯與現代音擬測模組。進一步進行整合與前端實作，實現以下功能：

* 將 `tshet-uinh` 提供的核心音韻演算法整合為模組化函式
* 導入語音地位比對、候選項管理與反切推導模組
* 使用 React + Tailwind CSS 構建互動式前端
* 支援使用者輸入上下字，動態計算反切結果
* 顯示每一步操作的語音學推理與中間結果

本工具非簡單前端展示，而是完整整合中古漢語音韻邏輯的語言學應用平台。

## 使用方式

<https://nk2028.shn.hk/tshet-uinh-fanqie/>

---

# Fanqie Calculator

## Project Overview

**Fanqie Calculator** is a tool for the study of Middle Chinese phonology. It calculates the reconstructed pronunciation of a character based on the *fanqie* spelling—using the phonological properties of the *upper* and *lower* characters. This tool systematizes and visualizes the logic of *fanqie*, offering real-time derivation and modern phonetic conversion. It is designed to faithfully reconstruct the *fanqie* system within an interactive framework informed by modern phonological theory.

## Features

* Automatically analyzes the phonological position (音韻地位) of the upper and lower characters
* Applies formal *fanqie* rules to infer the phonological position of the target character
* Provides corresponding modern pronunciations (e.g., Pinyin, IPA, or other phonetic notations)
* Displays detailed derivation steps and phonological reasoning, suitable for pedagogy and research
* Supports candidate disambiguation and manual selection of multiple phonological interpretations
* Aesthetic, responsive, interactive user interface optimized for both desktop and mobile platforms

## Purpose

This project aims to offer a functional, visual, and precise implementation of the Middle Chinese *fanqie* system. It serves as a supporting platform for research in historical Chinese linguistics and phonology, as well as a pedagogical tool for educators and an exploration platform for enthusiasts.

The tool addresses the current lack of accessible and accurate digital implementations of *fanqie* derivation, which is often obscure, non-operational, or under-documented in contemporary phonological research.

## Methodology

This tool is built upon the Tshet-Uinh project series by [nk2028](https://github.com/nk2028), which provides structured phonological data, *fanqie* rule logic, and modern pronunciation derivation modules for Middle Chinese. This project extends and integrates that foundation with a modern frontend to implement the following:

* Modular integration of core phonological algorithms from `tshet-uinh`
* Incorporation of phonological matching, candidate selection, and *fanqie* derivation logic
* Frontend built with React and Tailwind CSS for interactive computation
* Real-time derivation of the target character’s phonological profile based on user input
* Visual representation of the full phonological reasoning and derivation process

This is not a superficial frontend interface—it is a full-fledged linguistic platform that embeds Middle Chinese phonological logic into a functional application.

## Usage

<https://nk2028.shn.hk/tshet-uinh-fanqie/>
