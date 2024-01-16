"use client"

import Image from "next/image"

import { Icons } from "@/components/icons"

import { SectionBadge } from "../common/section-badge"
import { SectionDescription } from "../common/section-description"
import { SectionTitle } from "../common/section-title"

const features = [
  {
    title: "Hybrid Vision",
    description:
      "Seamlessly combining online publishing with Telegram mailing for a novel digital experience.",
    bottomImage: "/images/home/feature-bottom-1.png",
  },
  {
    title: "Swift Identification",
    description:
      "Quickly identify and connect with other users on the Telegram network through our Pax platform.",
    bottomImage: "/images/home/feature-bottom-2.png",
  },
  {
    title: "Advanced Communication",
    description:
      "Enhance your Telegram communications with features for efficient indexing and information sharing.",
    bottomImage: "/images/home/feature-bottom-3.png",
  },
  {
    title: "3D World Experience",
    description:
      "Immerse yourself in a new dimension of creativity, where you can interact with familiar activities in a unique format.",
    bottomImage: "/images/home/feature-bottom-4.png",
  },
]

function FeatureCard({
  title,
  description,
  bottomImage,
}: {
  title: string
  description: string
  bottomImage: string
}) {
  return (
    <div
      data-theme="light"
      className={`group relative mx-auto flex w-full max-w-[350px] flex-col gap-4 overflow-hidden rounded-3xl bg-muted font-satoshi transition-all duration-500 hover:bg-transparent`}
    >
      <div
        className="absolute left-0 top-0 z-[-1] h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, #00B887 0%, #01B6D3 100%), linear-gradient(7deg, #7B2BCC 21.22%, #2296F3 88.72%)",
        }}
      ></div>
      <div className="m-6 mb-0 flex items-center justify-start bg-transparent">
        <Icons.bag
          className="h-8 w-8 group-hover:hidden dark:hidden"
          fill="black"
        />
        <Icons.bag
          className="hidden h-8 w-8 group-hover:block dark:block"
          fill="white"
        />
      </div>
      <div
        className={`mx-6 text-lg font-bold text-secondary-foreground group-hover:text-secondary`}
      >
        {title}
      </div>
      <div
        className={`mx-6 text-sm text-muted-foreground group-hover:text-muted`}
      >
        {description}
      </div>
      <Image
        src={bottomImage}
        width={291}
        height={152}
        alt="feature"
        className="mt-auto w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </div>
  )
}

export function FeatureSection() {
  return (
    <div className="flex flex-col items-center justify-center">
      <SectionBadge>Discover PaxinTrade</SectionBadge>
      <SectionTitle>Unleashing the Future of Online Interaction</SectionTitle>
      <SectionDescription>
        Explore the unique blend of online publishing and Telegram mailing. From
        streamlined searches to launching your 3D world,
      </SectionDescription>
      <div className="relative mt-10 grid w-full grid-cols-1 items-stretch justify-center gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            bottomImage={feature.bottomImage}
          />
        ))}
      </div>
    </div>
  )
}