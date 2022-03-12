import React from "react";
import Image from "next/image";
import Link from "next/link";

//import specific images
import CincinnatiImage from "../public/images/Cincinnati_OH.jpg";
import WilmingtonImage from "../public/images/Wilmington_OH.jpg";
import ColumbusImage from "../public/images/Columbus_OH.jpg";
import ClevelandImage from "../public/images/Cleveland_OH.jpg";

const places = [
  {
    name: "Cincinnati",
    image: CincinnatiImage,
    url: "/location/cincinnati-4508722",
  },
  {
    name: "Wilmington",
    image: WilmingtonImage,
    url: "/location/wilmington-4528463",
  },
  {
    name: "Columbus",
    image: ColumbusImage,
    url: "/location/columbus-4509177",
  },
  {
    name: "Cleveland",
    image: ClevelandImage,
    url: "/location/cleveland-5150529",
  },
];

export default function FamousPlaces() {
  return (
    <div className="places">
      <div className="places__row">
        {places.length > 0 &&
          places.map((place, index) => (
            <div className="places__box" key={index}>
              <Link href={place.url}>
                <a>
                  <div className="places__image-wrapper">
                    <Image
                      src={place.image}
                      alt={`${place.name}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <span>{place.name}</span>
                </a>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
