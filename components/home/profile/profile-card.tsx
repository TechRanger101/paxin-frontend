import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { BiSolidCalendar } from "react-icons/bi"
import { BsCalendarDateFill } from "react-icons/bs"
import { GrArticle } from "react-icons/gr"
import Slider from "react-slick"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TagBadge } from "@/components/common/tag-badge"

import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import "../slider.css"
import { CategoryCard } from "./category-card"
import { CityCard } from "./city-card"
import { QRCodeModal } from "./qrcode-modal"

export interface ProfileCardProps {
  username: string
  bio: string
  avatar: string
  tags: string[]
  cities: string[]
  categories: string[]
  qrcode: string
  countrycode: string
  review: {
    totaltime: number
    monthtime: number
    totalposts: number
  }
}

function SampleNextArrow(props: any) {
  const { onClick } = props
  return (
    <div className="absolute right-0 top-0 z-10 flex h-full items-center justify-center">
      <Button className="h-6 w-6 rounded-full" onClick={onClick} size="icon">
        <ChevronRightIcon className="h-5 w-5 text-white" />
      </Button>
    </div>
  )
}

function SamplePrevArrow(props: any) {
  const { onClick } = props
  return (
    <div className="absolute left-0 top-0 z-10 flex h-full items-center justify-center">
      <Button className="h-6 w-6 rounded-full" onClick={onClick} size="icon">
        <ChevronLeftIcon className="h-5 w-5 text-white" />
      </Button>
    </div>
  )
}

function ProfileCard(profile: ProfileCardProps) {
  const {
    username,
    bio,
    avatar,
    tags,
    cities,
    categories,
    qrcode,
    countrycode,
    review,
  } = profile

  const settings = {
    dots: false,
    infinite: false,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
  }

  return (
    <Card>
      <CardContent className="relative flex max-w-[400px] flex-col gap-4 p-3">
        <div className="relative">
          <Image
            src={avatar}
            width={370}
            height={234}
            alt="profile"
            className="h-auto w-full"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-lg rounded-b-none bg-gradient-to-b from-transparent via-transparent to-white dark:to-black"></div>
          <div className="absolute top-3 flex w-full justify-between gap-2 px-4">
            <QRCodeModal qrcode={qrcode} />
            <Badge
              variant="default"
              className="border-none !bg-black/50 p-2 text-white"
            >
              <GrArticle className="mr-2 h-4 w-4 text-white" />
              {review.totalposts}
            </Badge>
          </div>
        </div>
        <div className="relative w-full max-w-[100%]">
          <Slider {...settings}>
            {tags.map((tag, index) => (
              <TagBadge key={index}>{tag}</TagBadge>
            ))}
          </Slider>
        </div>
        <div className="relative">
          <div
            className={`absolute right-0 top-3 h-8 w-8 rounded-full bg-[url('https://flagcdn.com/${countrycode}.svg')] bg-cover bg-center bg-no-repeat`}
          ></div>
        </div>
        <div className="font-satoshi">
          <div className="text-xl font-semibold text-secondary-foreground">
            {username}
          </div>
          <div className="text-sm text-muted-foreground">{bio}</div>
        </div>
        <div>
          <div className="flex items-center justify-start gap-2 text-muted-foreground">
            <BsCalendarDateFill className="h-5 w-5 text-black dark:text-white" />
            This month:{" "}
            {`${Math.floor(review.monthtime / 60)}h : ${review.monthtime % 60 < 10 ? "0" + (review.monthtime % 60) : review.monthtime % 60}m`}
          </div>
          <div className="flex items-center justify-start gap-2 text-muted-foreground">
            <BiSolidCalendar className="h-5 w-5 text-black dark:text-white" />
            Total time:{" "}
            {`${Math.floor(review.totaltime / 60)}h : ${review.totaltime % 60 < 10 ? "0" + (review.totaltime % 60) : review.totaltime % 60}m`}
          </div>
        </div>
        <div className="flex gap-3">
          <CityCard cities={cities} />
          <CategoryCard categories={categories} />
        </div>
        <div className="flex justify-between">
          <Button variant="default" className="w-full font-sans">
            View Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { ProfileCard }