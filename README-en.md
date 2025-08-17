# Fanqie Calculator

## Project Overview

**Fanqie Calculator** is a tool for the study of Middle Chinese phonology. It calculates the extrapolated modern pronunciation of a character based on the *fanqie* spelling—using the phonological properties of the *fanqie* *upper* and *lower* characters. This tool systematises and visualises the logic of *fanqie*, offering real-time derivation and modern phonetic conversion. It is designed to faithfully reconstruct the *fanqie* system within an interactive framework informed by contemporary approaches to traditional Chinese phonology.

## Features

* Automatically analyses the phonological position (音韻地位) of the upper and lower characters
* Applies formal *fanqie* rules to infer the phonological position of the target character
* Includes dedicated rules for processing irregular *fanqie* spellings found in historical sources
* Provides corresponding modern pronunciations (e.g., Pinyin, IPA, or other phonetic notations)
* Displays detailed derivation steps and phonological reasoning, suitable for pedagogy and research
* Supports candidate disambiguation and manual selection of multiple phonological interpretations
* Aesthetic, responsive, interactive user interface optimised for both desktop and mobile platforms

## Purpose

This project aims to offer a functional, visual, and precise implementation of the Middle Chinese *fanqie* system. It serves as a supporting platform suitable for academic inquiry, theoretical instruction, and advanced exploration by enthusiasts of historical Chinese phonology.

The tool addresses the current lack of accessible and accurate digital implementations of *fanqie* derivation, which is often obscure, non-operational, or under-documented in contemporary linguistic research.

## Methodology

This tool is built upon the Tshet-Uinh project series by [nk2028](https://github.com/nk2028), which provides structured phonological data, *fanqie* rule logic, and modern pronunciation derivation modules for Middle Chinese. This project extends and integrates that foundation with a modern frontend to implement the following:

* Modular integration of core phonological algorithms from `tshet-uinh`
* Incorporation of phonological matching, candidate selection, and *fanqie* derivation logic
* Frontend built with React and Tailwind CSS for interactive computation
* Real-time derivation of the target character’s phonological profile based on user input
* Visual representation of the full phonological reasoning and derivation process

This is not a superficial frontend interface—it is a full-fledged linguistic platform that embeds Middle Chinese phonological logic into a functional application.

## Usage

Access directly at <https://nk2028.shn.hk/tshet-uinh-fanqie/>.
