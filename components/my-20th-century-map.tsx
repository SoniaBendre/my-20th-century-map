"use client"

import React, { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line
} from "react-simple-maps"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { geoCentroid } from "d3-geo"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"

const orientExpressRoute: [number, number][] = [
  [2.3522, 48.8566], // Paris
  [8.5417, 47.3769], // Zurich
  [16.3738, 48.2082], // Vienna
  [19.0402, 47.4979], // Budapest
  [26.1025, 44.4268]  // Bucharest
]

const locations = [
  {
    name: "Budapest, 1880",
    coordinates: [18.6402, 47.4979],
    info: "Twin sisters Dóra and Lili are born to a poverty-stricken mother on the night Thomas Edison unveils his electric light bulb. Their birth symbolically intertwines with the dawn of electricity and modern technology. Budapest at this time was experiencing rapid modernization, becoming known as the 'Paris of the East'.",
    year: 1880,
    imageUrl: "/images/budapest-1880.jpg",
    additionalInfo: {
      historicalContext: "The 1880s marked Budapest's golden age, with the construction of Andrássy Avenue and the Royal Opera House.",
      technologicalMilestone: "Edison's incandescent light bulb demonstration in Menlo Park (1879) marked the beginning of widespread electrical illumination."
    }
  },
  {
    name: "Budapest Orphanage, 1885",
    coordinates: [19.302, 47.4979],
    info: "The twins are separated when a wealthy benefactor takes one girl, while the other remains behind. This separation mirrors the film's central theme of duality - between wealth and poverty, technology and nature, light and darkness. The orphanage scenes were filmed in authentic 19th-century buildings, capturing the period's institutional architecture.",
    year: 1885,
    labelY: 20,
    imageUrl: "/images/orphanage-scene.jpg",
    additionalInfo: {
      socialContext: "Child poverty and orphanages were common in 1880s Budapest, reflecting the stark social inequalities of the industrial revolution.",
      filmTechnique: "Director Enyedi uses high-contrast black and white cinematography to emphasize the twins' contrasting destinies."
    }
  },
  {
    name: "Hamburg, 1900",
    coordinates: [10.0, 53.45],
    info: "Dóra emerges as a sophisticated courtesan in Hamburg's high society. She manipulates wealthy men using modern luxuries like telegram offices and grand hotels. The port city represents both the prosperity and moral ambiguity of the new century. Dóra's character embodies the materialistic aspects of progress, using technology for personal gain.",
    year: 1900,
    labelY: 20,
    imageUrl: "/images/hamburg-1900.jpg",
    additionalInfo: {
      characterStudy: "Dóra represents the seductive and deceptive aspects of modernity, using new technologies to orchestrate her schemes.",
      historicalSetting: "Hamburg was one of Europe's wealthiest ports, known for luxury hotels and international commerce."
    }
  },
  {
    name: "Revolutionary Meeting, 1900",
    coordinates: [16.1738, 48.4082],
    info: "Lili becomes a passionate anarchist and feminist, fighting for women's suffrage and workers' rights. She distributes revolutionary pamphlets and attends secret meetings. Her character represents the idealistic, utopian dreams of the early 20th century. The film shows her encounters with early feminist movements and revolutionary circles.",
    year: 1900,
    imageUrl: "/images/revolutionary-scene.jpg",
    additionalInfo: {
      politicalContext: "The turn of the century saw rising feminist and workers' movements across Europe.",
      symbolism: "Lili's activism represents the progressive, humanist potential of modernity."
    }
  },
  {
    name: "Paris World Fair, 1900",
    coordinates: [2.3522, 48.8566],
    info: "The 1900 Exposition Universelle in Paris celebrated the achievements of the 19th century and the promise of the 20th. The fair featured innovations like moving sidewalks, diesel engines, and talking films. The film recreates the fair's electric lighting displays and the sense of wonder they inspired. The twins unknowingly cross paths here, amidst displays of technological marvels.",
    year: 1900,
    imageUrl: "/images/paris-1900.jpg",
    additionalInfo: {
      technologicalDisplay: "The fair showcased escalators, wireless telegraphy, and the Grande Roue de Paris Ferris wheel.",
      culturalSignificance: "The exposition marked the height of the Belle Époque and faith in progress."
    }
  }
]

export default function My20thCenturyMap() {
  const [selectedLocation, setSelectedLocation] = useState<(typeof locations)[0] | null>(null)

  const handleLocationClick = (location: typeof locations[0]) => {
    setSelectedLocation(location);
  };

  return (
    <div className="w-full h-screen bg-[#f4e9d9] p-4">
      <h1 className="text-3xl font-serif mb-4 text-center text-[#2c1810]">My 20th Century: A Tale of Twin Destinies</h1>
      <div className="w-full aspect-[2/1] border-4 border-[#2c1810] rounded-lg overflow-hidden bg-[#e8d5b5]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [15, 48],
            scale: 1400
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies, projection }) =>
              geographies.map((geo) => {
                const centroid = geoCentroid(geo);
                const projectedCentroid = projection(centroid);
                const isEuropean = 
                  centroid[0] >= -25 && 
                  centroid[0] <= 40 && 
                  centroid[1] >= 35 && 
                  centroid[1] <= 70;

                return (
                  <React.Fragment key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      fill="#d5c3a1"
                      stroke="#2c1810"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: "none",
                        },
                        hover: {
                          fill: "#d5c3a1",
                          outline: "none",
                        },
                        pressed: {
                          outline: "none",
                        },
                      }}
                    />
                    {isEuropean && projectedCentroid && (
                      <text
                        x={projectedCentroid[0]}
                        y={projectedCentroid[1]}
                        textAnchor="middle"
                        style={{
                          fontFamily: 'serif',
                          fontSize: '6px',
                          fill: '#2c1810',
                          pointerEvents: 'none',
                        }}
                      >
                        {geo.properties.name}
                      </text>
                    )}
                  </React.Fragment>
                );
              })
            }
          </Geographies>

          <Line
            coordinates={orientExpressRoute}
            stroke="#2c1810"
            strokeWidth={2}
            strokeDasharray="5,5"
          />

          {locations.map((location) => (
            <Marker
              key={location.name}
              coordinates={location.coordinates as [number, number]}
              onClick={() => handleLocationClick(location)}
            >
              <circle
                r={5}
                fill="#2c1810"
                stroke="#f4e9d9"
                strokeWidth={2}
                style={{ cursor: 'pointer' }}
              />
              <text
                textAnchor="middle"
                y={-10}
                style={{
                  fontFamily: 'serif',
                  fontSize: '8px',
                  fill: '#2c1810',
                }}
              >
                {location.year}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
      
      <Dialog open={!!selectedLocation} onOpenChange={() => setSelectedLocation(null)}>
        <DialogContent className="bg-[#f4e9d9] border-[#2c1810] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#2c1810]">{selectedLocation?.name}</DialogTitle>
            <div className="relative w-full h-48 mb-4">
              <img
                src={selectedLocation?.imageUrl}
                alt={selectedLocation?.name}
                className="object-cover w-full h-full rounded-md"
              />
            </div>
            <DialogDescription className="text-[#2c1810] space-y-4">
              <p className="text-lg">{selectedLocation?.info}</p>
              <div className="mt-4 space-y-6">
                {selectedLocation?.additionalInfo && Object.entries(selectedLocation.additionalInfo).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <h4 className="font-serif font-bold capitalize text-lg">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </h4>
                    <p className="text-sm mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setSelectedLocation(null)}
            className="bg-[#2c1810] hover:bg-[#4c2820]"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

