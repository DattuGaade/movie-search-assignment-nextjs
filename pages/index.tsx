import { useEffect, useState } from "react"
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import {
  Input,
  Button,
  Select,
  Option,
  Alert
} from "@material-tailwind/react";

import MoviePoster from "../components/MoviePoster";
import useDebounce from "../hooks/useDebounce";

import { AUTH_TOKEN } from "../constants";

export default function Home({ moviesResult }: any) {
  const [searchText, setSearchText] = useState("");
  const [movies, setMovies] = useState<{
    id: string,
    title: string,
    release_date: string,
    poster_path: string,
    overview: string,
  }[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (moviesResult) {
      setCurrentPage(moviesResult.page);
      if (moviesResult.total_pages !== moviesResult.page) {
        setShowLoadMore(true);
      }
      setMovies(
        moviesResult.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
          overview: movie.overview,
        }))
      )
    } else {
      getPopularMovies(1);
    }
  }, [moviesResult])

  const getPopularMovies = async (pageNo: number) => {
    setIsLoading(true);
    try {
      const result = await fetch(`https://api.themoviedb.org/3/movie/popular?&language=en-US&page=${pageNo ? pageNo : (currentPage + 1)}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`
        }
      })
      const resultData = await result.json();
      if (resultData) {
        setCurrentPage(resultData.page);
        if (resultData.total_pages === resultData.page) {
          setShowLoadMore(false);
        } else {
          setShowLoadMore(true);
        }
        setMovies(prevList => {
          resultData.results.forEach((movie: any) => {
            prevList.push({
              id: movie.id,
              title: movie.title,
              release_date: movie.release_date,
              poster_path: movie.poster_path,
              overview: movie.overview,
            })
          })
          return prevList;
        })
      }
    } catch (error) {
      console.log('Error fetching popular movies: ', error);
    }
    setIsLoading(false);
  }

  const getFilteredMovies = useDebounce(async (pageNo: number, searchStr: string) => {
    setIsLoading(true);
    try {
      const result = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchStr ?? ""}&language=en-US&page=${pageNo ? pageNo : (currentPage + 1)}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`
        }
      })
      const resultData = await result.json();
      if (resultData) {
        setCurrentPage(resultData.page);
        if (resultData.total_pages === resultData.page) {
          setShowLoadMore(false);
        } else {
          setShowLoadMore(true);
        }
        setMovies(prevList => {
          resultData.results.forEach((movie: any) => {
            prevList.push({
              id: movie.id,
              title: movie.title,
              release_date: movie.release_date,
              poster_path: movie.poster_path,
              overview: movie.overview,
            })
          })
          return prevList;
        })
      }
    } catch (error) {
      console.log('Error fetching filtered movies: ', error);
    }
    setIsLoading(false);
  }, 500)

  const handleTextChange = (event: any) => {
    let searchStr = event.target?.value ?? "";
    setSearchText(searchStr);
    setMovies([]);
    setCurrentPage(0);
    if (searchStr) {
      getFilteredMovies(1, searchStr);
    } else {
      getPopularMovies(1);
    }
  }

  const handleClearText = () => {
    setSearchText("");
    setMovies([]);
    setCurrentPage(0);
    getPopularMovies(1);
  }

  const handleSortChange = (valueSelected: string | undefined) => {
    console.log({ valueSelected })
  }

  const handleLoadMore = () => {
    if (searchText) {
      getFilteredMovies(currentPage + 1, searchText);
    } else {
      getPopularMovies(currentPage + 1);
    }
  }

  return (
    <div className="flex flex-col pt-10 px-20">

      <div className="relative">
        <Input
          placeholder="Search movies"
          value={searchText}
          onChange={handleTextChange}
          className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          containerProps={{
            className: "min-w-0",
          }}
        />
        <Button
          placeholder="Input clear button"
          size="sm"
          className="!absolute right-1 top-1 rounded bg-transparent text-gray-700 !shadow-none outline-none"
          onClick={handleClearText}
        >
          X
        </Button>
      </div>

      {movies.length > 0 ?
        <div className="w-72 mt-3">
          <Select
            placeholder="Sort options dropdown"
            label="Sort By"
            animate={{
              mount: { y: 0 },
              unmount: { y: 25 },
            }}
            onChange={handleSortChange}
          >
            <Option value="popularity.desc">Most Popular</Option>
            <Option value="popularity.asc">Least Popular</Option>
            <Option value="primary_release_date.desc">Latest Releases</Option>
            <Option value="primary_release_date.asc">Old Releases</Option>
          </Select>
        </div> : null
      }

      <div className="flex flex-wrap gap-5 mt-5">
        {movies.map(movie =>
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <MoviePoster title={movie.title} release_date={movie.release_date} poster_path={movie.poster_path} />
          </Link>
        )}
        {movies.length <= 0 && !isLoading &&
          <Alert color="blue">No Movies Available</Alert>
        }
      </div>

      {
        showLoadMore &&
        <Button
          placeholder="load-more-btn"
          loading={isLoading}
          className="w-48 my-4 mx-auto"
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load more"}
        </Button>
      }
    </div >
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const result = await fetch(`https://api.themoviedb.org/3/movie/popular?&language=en-US&page=1`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`
      }
    });

    const resultData = await result.json();
    return {
      props: {
        moviesResult: resultData
      },
    };

  } catch (error) {
    console.log('Error fetching movie details', error);
    return {
      props: {
        moviesResult: null
      },
    };
  }
};

