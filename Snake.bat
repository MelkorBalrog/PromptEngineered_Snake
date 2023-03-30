@echo off
setlocal enabledelayedexpansion

rem Input file name
set inputFile=Snake.css

rem Output file name
set outputFile=Snake.css

rem Open the input file
for /f "usebackq delims=" %%a in ("%inputFile%") do (
    set line=%%a
    rem Remove the first 5 characters
    set line=!line:~5!
    echo !line! >> %outputFile%
)

echo File %inputFile% has been stripped and saved as %outputFile%

rem Input file name
set inputFile=Snake.html

rem Output file name
set outputFile=Snake.html

rem Open the input file
for /f "usebackq delims=" %%a in ("%inputFile%") do (
    set line=%%a
    rem Remove the first 5 characters
    set line=!line:~5!
    echo !line! >> %outputFile%
)

echo File %inputFile% has been stripped and saved as %outputFile%

rem Input file name
set inputFile=Snake.js

rem Output file name
set outputFile=Snake.js

rem Open the input file
for /f "usebackq delims=" %%a in ("%inputFile%") do (
    set line=%%a
    rem Remove the first 5 characters
    set line=!line:~5!
    echo !line! >> %outputFile%
)

echo File %inputFile% has been stripped and saved as %outputFile%