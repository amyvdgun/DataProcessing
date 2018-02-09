#!/usr/bin/env python
# Name: Amy van der Gun
# Student number: 10791760
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from bs4 import SoupStrainer

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    
    # create lists
    title = []
    rating = []
    genre = []
    actors = []
    runtime = []

    # get the data and divide it in a div
    data = dom.find_all("div", {"class": "lister-item mode-advanced"})

    # get and add the titles of the series
    for i in data:
        titles = i.find("h3", {"class": "lister-item-header"})

        title.append(titles.find("a").get_text(strip = True))

    # get rating and add it
    for j in data:
        ratings = j.find("div", {"class": "inline-block ratings-imdb-rating"})

        rating.append(ratings.find("strong").get_text(strip = True))

    # add the genre
    for k in data:
        genre.append(k.find("span", {"class": "genre"}).get_text(strip = True))

    # get and add the actors
    for l in data:
        actor = l.find("div", {"class": "lister-item-content"})

        p = actor.find_all("p")[2].find_all("a")

        # make a list for each series and add the actors
        actorsnew = []
        for i in p:
            actorsnew.append(i.text)
        actors.append(actorsnew)

    # add the runtime
    for m in data:
        runtime.append(m.find("span", {"class": "runtime"}).get_text(strip = True))

    # add all lists to one
    tvseries = {"Title": title, "Rating": rating, "Genre": genre, "Actors": actors, "Runtime": runtime}

    return tvseries


def save_csv(outfile, Tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    series = list(tvseries.values())

    # create different lists
    title = series[0]
    rating = series[1]
    genre = series[2]
    actors = series[3]
    runtime = series[4]

    # write for each series
    for i in range(len(title)):
        actorsnew = str(actors[i])
        # write the lists into csv file
        writer.writerow([title[i], rating[i], genre[i], actorsnew, runtime[i]])

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
