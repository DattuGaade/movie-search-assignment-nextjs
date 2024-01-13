import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  Typography
} from "@material-tailwind/react";

interface MovieDetailsProps {
  title: string;
  release_date: string;
  poster_path: string;
  runtime: number;
  overview: string
}

const MovieDetails = ({ title, release_date, poster_path, runtime, overview }: MovieDetailsProps) => {
  return (
    <Card placeholder="Movie details container" className="mt-6 w-1/3">
      <CardHeader placeholder="Movie details poster container" color="blue-gray" className="relative h-56 mt-2">
        <Image
          className="h-56 rounded-md"
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          alt={title}
          fill
        />
      </CardHeader>
      <CardBody placeholder="Movie details body container">
        <Typography placeholder="Movie title" variant="h2" color="blue-gray" className="mb-2">
          {title}
        </Typography>
        <div className="flex items-center justify-between my-3">
          <Typography placeholder="Movie release date" variant="h6" color="blue-gray" className="font-medium">
            Release Date: {release_date}
          </Typography>
          <Typography placeholder="Movie runtime in min" className="font-normal">{runtime} min</Typography>
        </div>
        <Typography placeholder="Movie summary" >
          {overview}
        </Typography>
      </CardBody>
    </Card>
  )
}

export default MovieDetails;