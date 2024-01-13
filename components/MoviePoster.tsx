import Image from "next/image";
import {
  Card,
  Tooltip,
  Typography
} from "@material-tailwind/react";

interface MoviePosterProps {
  title: string;
  release_date: string;
  poster_path: string;
}

const MoviePoster = ({ title, release_date, poster_path }: MoviePosterProps) => {
  return (
    <Tooltip
      className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 25 },
      }}
      content={
        <div className="w-auto">
          <Typography placeholder="Title" color="blue-gray" className="font-bold">
            {title}
          </Typography>
          <Typography
            placeholder="Release Date"
            variant="small"
            color="blue-gray"
            className="font-normal opacity-80"
          >
            Release Date: {release_date}
          </Typography>
        </div>
      }>
      <Card placeholder="Movie poster container" className="rounded-md cursor-pointer">
        <Image
          className="w-36 h-36 rounded-md"
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          alt={title}
          width={150}
          height={150}
        />
      </Card>
    </Tooltip>
  )
}

export default MoviePoster;