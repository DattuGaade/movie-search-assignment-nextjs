import { GetServerSideProps } from 'next';
import Link from 'next/link';
import {
  Button,
  Alert
} from "@material-tailwind/react";

import MovieDetailsCard from "../../components/MovieDetails";
import { AUTH_TOKEN } from '@/constants';

const MovieDetails = ({ movieDetails }: any) => {
  return (
    <div>
      <Link href={`/`} className='inline-block'>
        <Button placeholder="Go back button" variant="text" className="flex items-center gap-2 m-3">
          &laquo;{" "}Go Back
        </Button>
      </Link>
      <div className="flex justify-center mt-9">
        {movieDetails ?
          <MovieDetailsCard
            title={movieDetails.title}
            poster_path={movieDetails.poster_path}
            release_date={movieDetails.release_date}
            runtime={movieDetails.runtime}
            overview={movieDetails.overview}
          /> :
          <Alert className='w-1/2' color="red">Details not found</Alert>
        }
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  if (!params) {
    return {
      notFound: true,
    };
  }

  const { id }: any = params;

  try {
    const result = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`
      }
    });

    const resultData = await result.json();
    return {
      props: {
        movieDetails: resultData
      },
    };

  } catch (error) {
    console.log('Error fetching movie details', error);
    return {
      props: {
        movieDetails: null
      },
    };
  }
};

export default MovieDetails;