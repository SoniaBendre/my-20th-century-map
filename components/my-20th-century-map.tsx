"use client"

import React, { useState, useCallback } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup
} from "react-simple-maps"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { geoCentroid } from "d3-geo"
import Image from 'next/image'

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"

const orientExpressRoute: [number, number][] = [
  [2.3522, 48.8566],    // Paris, France
  [8.5417, 47.3769],    // Zurich, Switzerland
  [16.3738, 48.2082],   // Vienna, Austria
  [16.8719, 47.8388],   // Királyhida/Bruck an der Leitha (Austria-Hungary border)
  [19.0402, 47.4979],   // Budapest, Hungary
  [26.1025, 44.4268],   // Bucharest, Romania
  [28.9784, 41.0082]    // Constantinople (Istanbul), Ottoman Empire
]

const locations = [
  {
    name: "Budapest, Hungary",
    coordinates: [19.0402, 47.4979],      // Budapest city center
    info: "The heart of the film's narrative, Budapest hosts many key events that mirror the broader themes of modernity, duality, and transformation.",
    year: "1880-1900",
    imageUrl: "/images/budapest-1880.jpg",
    additionalInfo: {
      historicalContext: "Budapest was known as the 'Paris of the East', rapidly modernizing at the turn of the century.",
      keyEvents: [
        {
          name: "Twin's Birth (1880)",
          description: "Twins Lili and Dóra are born to an impoverished mother as Edison unveils his lightbulb in America.",
          significance: "Links technological and natural miracles, establishing the film's parallel narratives."
        },
        {
          name: "Chimpanzee's Tale (1900)",
          description: "A caged chimpanzee narrates his capture by a hunter, exploring themes of consciousness and captivity.",
          significance: "Represents one of several non-human narrative perspectives in the film."
        },
        {
          name: "Feminist Union Lecture (1900)",
          description: "Lili attends Otto Weininger's comically misogynistic lecture that descends into absurdity.",
          significance: "Satirizes period philosophical attitudes toward women."
        },
        {
          name: "Telegraph Office (1900)",
          description: "The final sequence contrasts Edison's telegraph with an anarchist's carrier pigeon.",
          significance: "Questions the true nature of progress and communication."
        }
      ]
    }
  },
  {
    name: "Vienna, Austria",
    coordinates: [16.3738, 48.2082],      // Central Vienna
    info: "Vienna serves as a crucial location for both technological spectacle and revolutionary politics.",
    year: "1900",
    imageUrl: "/images/vienna-animals.jpg",
    additionalInfo: {
      historicalContext: "Vienna was the cultural and political center of the Austro-Hungarian Empire.",
      keyEvents: [
        {
          name: "Nickelodeon Screening",
          description: "Z attends a multi-screen presentation of Méliès films, creating a modern gallery-like experience.",
          significance: "Bridges early cinema with contemporary art installation."
        },
        {
          name: "Laboratory Dog Scene",
          description: "A dog watches found footage and escapes, incorporating scenes from Now You Tell One (1926).",
          significance: "Explores themes of animal consciousness and liberation."
        },
        {
          name: "Revolutionary Meeting",
          description: "Lili participates in anarchist and feminist gatherings, fighting for social change.",
          significance: "Represents the progressive political movements of the era."
        }
      ]
    }
  },
  {
    name: "Paris, France",
    coordinates: [2.3522, 48.8566],       // Central Paris
    info: "Paris represents both scientific advancement and artistic innovation.",
    year: "1890-1895",
    imageUrl: "/images/paris-1900.jpg",
    additionalInfo: {
      historicalContext: "Paris was the cultural capital of Europe and a center of technological innovation.",
      keyEvents: [
        {
          name: "Sorbonne Tesla Demonstration",
          description: "Z attends Tesla's electrical experiments, shown exclusively to wealthy men.",
          significance: "Highlights the gender politics of scientific advancement."
        },
        {
          name: "First Cinematograph Screening",
          description: "The Lumière brothers debut their revolutionary motion picture device.",
          significance: "Marks the birth of public film exhibition."
        }
      ]
    }
  },
  {
    name: "Menlo Park, New Jersey, USA",
    coordinates: [-74.2332, 40.7831],      // Edison's Laboratory
    info: "The film opens with Edison's lightbulb demonstration, where incandescent bulbs festoon trees like glowworms in an enchanted wood. A glum Thomas Edison launches his invention with great fanfare, including a marching band wearing lit bulbs on their heads.",
    year: "1880",
    imageUrl: "/images/edison-lab.jpg",
    additionalInfo: {
      historicalContext: "Edison's Menlo Park laboratory was known as the 'invention factory'.",
      keyEvents: [
        {
          name: "Light Bulb Demonstration",
          description: "Edison unveils his electric light bulb with theatrical flair, while stars in the night sky attempt to divert his attention.",
          significance: "Sets up the film's parallel between technological and natural wonders."
        }
      ]
    }
  },
  {
    name: "Hamburg, Germany",
    coordinates: [10.0, 53.45],            // Hamburg port area
    info: "Dóra emerges as a sophisticated courtesan in Hamburg's high society, manipulating wealthy men using modern luxuries like telegram offices and grand hotels.",
    year: "1900",
    imageUrl: "/images/hamburg-1900.jpg",
    additionalInfo: {
      historicalContext: "Hamburg was one of Europe's wealthiest port cities.",
      keyEvents: [
        {
          name: "Dóra's Schemes",
          description: "The materialistic twin uses modern technology and luxury establishments for personal gain.",
          significance: "Represents the seductive and deceptive aspects of modernity."
        }
      ]
    }
  },
  {
    name: "Mandalay, Burma (Myanmar)",
    coordinates: [96.1951, 21.9588],       // Historical Burma
    info: "Z's journey takes him to Burma, where Western scientific exploration meets Eastern mysticism.",
    year: "1900",
    imageUrl: "/images/burma-scene.jpg",
    additionalInfo: {
      historicalContext: "Burma represented the exotic East to Western explorers.",
      keyEvents: [
        {
          name: "Z's Expedition",
          description: "The scientist's journey to Burma reveals the limits of Western rationality.",
          significance: "Questions the superiority of Western scientific understanding."
        }
      ]
    }
  },
  {
    name: "New York City, USA",
    coordinates: [-74.0060, 40.7128],      // Manhattan
    info: "Site of a captivating Edison Light Show that demonstrates the theatrical nature of scientific progress.",
    year: "1895",
    imageUrl: "/images/ny-edison.jpg",
    additionalInfo: {
      historicalContext: "New York was becoming the center of American technological innovation.",
      keyEvents: [
        {
          name: "Edison Light Show",
          description: "A spectacular demonstration of electrical illumination showcases America's technological leadership.",
          significance: "Illustrates how scientific advancement became public entertainment."
        }
      ]
    }
  },
  {
    name: "Királyhida Border Station",
    coordinates: [16.8719, 47.8388],       // Austria-Hungary border
    info: "The Orient Express stops here on New Year's Eve 1900, straddling what would later become a significant east-west divide.",
    year: "1900",
    imageUrl: "/images/train-scene.jpg",
    additionalInfo: {
      historicalContext: "The border town symbolized the meeting point of Eastern and Western Europe.",
      keyEvents: [
        {
          name: "New Year's Eve Crossing",
          description: "The twins unknowingly share the train, with Dóra in first class and Lili in third class.",
          significance: "Represents the social and cultural divisions of the era."
        }
      ]
    }
  },
  {
    name: "Constantinople (Istanbul), Ottoman Empire",
    coordinates: [28.9784, 41.0082],       // Historical Constantinople
    info: "The final destination of the Orient Express represents the ultimate meeting point of East and West.",
    year: "1900",
    imageUrl: "/images/constantinople.jpg",
    additionalInfo: {
      historicalContext: "Constantinople was the gateway between Europe and Asia.",
      keyEvents: [
        {
          name: "Orient Express Terminus",
          description: "The journey's end point symbolizes the meeting of European modernity with Eastern traditions.",
          significance: "Embodies the film's themes of cultural intersection and transformation."
        }
      ]
    }
  }
]

const historicalOverlay = {
  imageUrl: "/images/my-20th-cent-poster.jpg",
  opacity: 0.15
}

const mapProjection = {
  center: [20, 30] as [number, number], // Centered more on Europe/Asia minor
  scale: 220, // Increased scale to zoom in more
  rotation: [0, 0, 0] as [number, number, number]
}

export default function My20thCenturyMap() {
  const [selectedLocation, setSelectedLocation] = useState<(typeof locations)[0] | null>(null)
  const [zoom, setZoom] = useState(220) // Initial scale value
  const [position, setPosition] = useState<[number, number]>([20, 30]) // Initial center position

  // Add zoom handlers
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 1000)) // Max zoom limit
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 100)) // Min zoom limit
  }

  const handleLocationClick = (location: typeof locations[0]) => {
    setSelectedLocation(location);
  };

  const isLabelVisible = () => {
    return true;
  };

  // Add handlers for dragging
  const handleMoveEnd = useCallback((position: { coordinates: [number, number]; zoom: number }) => {
    setPosition(position.coordinates)
  }, [])

  return (
    <div className="w-full h-screen bg-[#f4e9d9] p-4">
      <h1 className="text-3xl font-serif mb-4 text-center text-[#2c1810]">My 20th Century: A Tale of Twin Destinies</h1>
      
      {/* Add zoom controls */}
      <div className="absolute top-20 right-8 z-20 flex flex-col gap-2">
        <Button 
          onClick={handleZoomIn}
          className="bg-[#2c1810] hover:bg-[#4c2820] w-10 h-10 rounded-full"
          aria-label="Zoom in"
        >
          +
        </Button>
        <Button 
          onClick={handleZoomOut}
          className="bg-[#2c1810] hover:bg-[#4c2820] w-10 h-10 rounded-full"
          aria-label="Zoom out"
        >
          -
        </Button>
      </div>

      <div className="w-full aspect-[2/1] border-4 border-[#2c1810] rounded-lg overflow-hidden bg-[#e8d5b5] relative">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Image
            src={historicalOverlay.imageUrl}
            alt="Historical map overlay"
            fill
            className="object-cover mix-blend-multiply opacity-15"
            priority
          />
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: zoom
          }}
        >
          <ZoomableGroup
            center={position}
            onMoveEnd={handleMoveEnd}
            zoom={1}
            maxZoom={1}
            minZoom={1}
          >
            <Geographies geography={geoUrl}>
              {({ geographies, projection }) =>
                geographies.map((geo) => {
                  const centroid = geoCentroid(geo);
                  const projectedCentroid = projection(centroid);

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
                      {isLabelVisible() && projectedCentroid && (
                        <text
                          x={projectedCentroid[0]}
                          y={projectedCentroid[1]}
                          textAnchor="middle"
                          style={{
                            fontFamily: 'serif',
                            fontSize: '4px',
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
                <g>
                  {/* Larger transparent circle for better hover area */}
                  <circle
                    r={8}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Animated dot */}
                  <circle
                    r={5}
                    fill="#2c1810"
                    stroke="#f4e9d9"
                    strokeWidth={2}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as SVGCircleElement;
                      target.style.r = '7';
                      target.style.fill = '#4c2820';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as SVGCircleElement;
                      target.style.r = '5';
                      target.style.fill = '#2c1810';
                    }}
                  />
                </g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <Dialog open={!!selectedLocation} onOpenChange={() => setSelectedLocation(null)}>
        <DialogContent className="bg-[#f4e9d9] border-[#2c1810] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#2c1810]">
              {selectedLocation?.name} ({selectedLocation?.year})
            </DialogTitle>
            <div className="relative w-full h-48 mb-4">
              {selectedLocation?.imageUrl && (
                <Image
                  src={selectedLocation.imageUrl}
                  alt={selectedLocation.name}
                  fill
                  className="object-cover rounded-md"
                  priority
                />
              )}
            </div>
            <DialogDescription className="text-[#2c1810] space-y-4">
              <p className="text-lg">{selectedLocation?.info}</p>
              <div className="mt-4 space-y-6">
                {selectedLocation?.additionalInfo.keyEvents ? (
                  <>
                    <h3 className="font-serif font-bold text-xl">Key Events:</h3>
                    {selectedLocation.additionalInfo.keyEvents.map((event, index) => (
                      <div key={index} className="border-l-2 border-[#2c1810] pl-4 mb-4">
                        <h4 className="font-serif font-bold text-lg">{event.name}</h4>
                        <p className="text-sm mb-2">{event.description}</p>
                        <p className="text-sm italic">{event.significance}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  Object.entries(selectedLocation?.additionalInfo || {}).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <h4 className="font-serif font-bold capitalize text-lg">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </h4>
                      <p className="text-sm mt-1">{value}</p>
                    </div>
                  ))
                )}
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

