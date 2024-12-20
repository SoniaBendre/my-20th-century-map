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
    info: "Vienna marks where Lili boards the Orient Express. At the next stop after Vienna (location uncertain), the film explores themes of animal consciousness through the laboratory dog sequence.",
    imageUrl: "/images/vienna-animals.jpg",
    additionalInfo: {
      historicalContext: "Vienna was a major stop on the Orient Express route and a center of intellectual and cultural life in the Austro-Hungarian Empire.",
      keyEvents: [
        {
          name: "Lili's Departure",
          description: "Lili boards the Orient Express in Vienna, beginning the journey that will unknowingly reunite her with her twin.",
          significance: "Marks the beginning of the film's climactic train journey."
        },

        {
          name: "Laboratory Dog Scene (Next Stop)",
          description: "After Vienna, a dog watches found footage including scenes from Now You Tell One (1926) and escapes.",
          significance: "Explores themes of animal consciousness and liberation, occurring at the same uncertain location as the nickelodeon screening."
        }
      ]
    }
  },
  {
    name: "Paris, France",
    coordinates: [2.3522, 48.8566],       // Central Paris
    info: "Paris represents both scientific advancement and artistic innovation.",
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
    info: "On a boat in Hamburg's harbor, Z's fellow travelers express skepticism about Hungary's existence, suggesting it's a land 'invented by Shakespeare'. The scene highlights Western Europe's perception of the East.",
    imageUrl: "/images/hamburg-1900.jpg",
    additionalInfo: {
      historicalContext: "Hamburg was one of Europe's major ports, representing Western Europe's perspective on the East.",
      keyEvents: [
        {
          name: "Z's Journey",
          description: "During his boat journey, Z encounters Western Europeans who doubt the reality of Hungary, revealing cultural prejudices of the era.",
          significance: "Illustrates the cultural and intellectual divide between Western and Eastern Europe."
        }
      ]
    }
  },
  {
    name: "Mandalay, Burma (Myanmar)",
    coordinates: [96.1951, 21.9588],       // Historical Burma
    info: "Z's journey takes him to Burma, where Western scientific exploration meets Eastern mysticism.",
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
    info: "Z visits New York to witness Edison's captivating Light Show, demonstrating the theatrical nature of scientific progress and America's technological leadership.",
    imageUrl: "/images/ny-edison.jpg",
    additionalInfo: {
      historicalContext: "New York was becoming the center of American technological innovation.",
      keyEvents: [
        {
          name: "Edison Light Show",
          description: "Z attends a spectacular demonstration of electrical illumination, showcasing America's technological advancement.",
          significance: "Illustrates how scientific progress became public spectacle and entertainment."
        },
        {
          name: "Z's Observations",
          description: "Through Z's perspective, we see how Edison's demonstrations merged science with theatrical presentation.",
          significance: "Connects to the film's themes about the spectacle of modernity."
        }
      ]
    }
  },
  {
    name: "Királyhida Border Station",
    coordinates: [16.8719, 47.8388],       // Austria-Hungary border
    info: "The Orient Express stops here on New Year's Eve 1900, straddling what would later become a significant east-west divide.",
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

// Add initial values as constants at the top of the component
const INITIAL_ZOOM = 1;
const INITIAL_CENTER: [number, number] = [20, 30];

export default function My20thCenturyMap() {
  const [selectedLocation, setSelectedLocation] = useState<(typeof locations)[0] | null>(null)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)
  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER)

  // Add reset handler
  const handleReset = () => {
    setZoom(INITIAL_ZOOM);
    setCenter(INITIAL_CENTER);
  };

  // Improved zoom handlers
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 4)) // Max zoom of 4x
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5)) // Min zoom of 0.5x
  }

  const handleLocationClick = (location: typeof locations[0]) => {
    setSelectedLocation(location);
  };

  const isLabelVisible = () => {
    return true;
  };

  // Improved move handler
  const handleMoveEnd = useCallback((position: { coordinates: [number, number]; zoom: number }) => {
    setCenter(position.coordinates)
  }, [])

  // Add a scale helper function at component level
  const getMarkerScale = (zoom: number) => {
    return 1 / (zoom || 1); // Inverse scale with zoom
  };

  return (
    <div className="w-full min-h-screen bg-[#f4e9d9]">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-serif mb-4 text-center text-[#2c1810]">My 20th Century: A Tale of Twin Destinies</h1>

        <div className="mb-8 prose prose-lg mx-auto text-[#2c1810]">
          <p className="text-center max-w-3xl mx-auto">
            Explore the magical world of Ildikó Enyedi&apos;s 1989 masterpiece &ldquo;My 20th Century&rdquo; through this interactive map. 
            This enchanting film follows twin sisters separated at birth in Budapest, as they navigate the dawn of the 20th century 
            on divergent paths across Europe and beyond.
          </p>
        </div>

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
          <Button
            onClick={handleReset}
            className="bg-[#2c1810] hover:bg-[#4c2820] w-10 h-10 rounded-full"
            aria-label="Reset view"
          >
            ↺
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
              scale: 220 // Base scale
            }}
          >
            <ZoomableGroup
              center={center}
              zoom={zoom}
              onMoveEnd={handleMoveEnd}
              maxZoom={4}
              minZoom={0.5}
              translateExtent={[
                [-200, -200], // Min boundaries
                [1000, 600]   // Max boundaries
              ]}
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
                  <g transform={`scale(${getMarkerScale(zoom)})`}>
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

        <div className="flex flex-col md:flex-row gap-6 my-12">
          <div className="md:w-1/2 p-6 border-2 border-[#2c1810] rounded-lg bg-[#e8d5b5]">
            <h2 className="text-2xl font-serif text-center text-[#2c1810] mb-4">About the Film</h2>
            <div className="space-y-4 text-[#2c1810]">
              <p>
                &ldquo;My 20th Century&rdquo; (Az én XX. századom) is a luminous celebration of electricity, technology, 
                and the spirit of innovation that characterized the turn of the century. Through the story of 
                twin sisters Dóra and Lili, separated as young girls in Budapest, the film weaves together 
                themes of duality, progress, and the wonder of scientific discovery.
              </p>
              <p>
                Winner of the Caméra d&apos;Or at the 1989 Cannes Film Festival, the film follows Dóra, who becomes 
                a swindler traveling first-class, and Lili, who becomes an anarchist and feminist. Their paths 
                cross unknowingly aboard the Orient Express on New Year&apos;s Eve, 1900, while a third character, Z, 
                encounters both women without realizing they are twins.
              </p>
            </div>
          </div>

          <div className="md:w-1/2 p-6 border-2 border-[#2c1810] rounded-lg bg-[#e8d5b5]">
            <h2 className="text-2xl font-serif text-center text-[#2c1810] mb-6">Key Locations</h2>
            <p className="text-center mb-6 text-[#2c1810]">
              Click on any location below or on the map markers to explore the significant moments 
              and events that unfold across these historic sites.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {locations.map((location) => (
                <button
                  key={location.name}
                  onClick={() => handleLocationClick(location)}
                  className="text-left p-2 hover:bg-[#d5c3a1] rounded transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#2c1810]" />
                    <span className="font-serif text-sm text-[#2c1810]">
                      {location.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-[#2c1810]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-[2px] bg-[#2c1810] dash-line" />
                <span className="font-serif">Orient Express Route</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedLocation} onOpenChange={() => setSelectedLocation(null)}>
        <DialogContent className="bg-[#f4e9d9] border-[#2c1810] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#2c1810]">
              {selectedLocation?.name}
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
                  Object.entries(selectedLocation?.additionalInfo || {})
                    .filter(([key]) => key !== 'keyEvents')
                    .map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <h4 className="font-serif font-bold capitalize text-lg">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </h4>
                        <p className="text-sm mt-1">
                          {typeof value === 'string' ? value : JSON.stringify(value)}
                        </p>
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

      <div className="text-center py-8 border-t border-[#2c1810]/20 mt-8">
        <p className="font-serif text-[#2c1810] italic">
          Created by Sonia Bendre
          <span className="mx-2">•</span>
          <span className="font-normal">AIT Budapest - Budapest Through Cinema, People and Streets</span>
        </p>
      </div>

      <style jsx>{`
        .dash-line {
          background: repeating-linear-gradient(
            90deg,
            #2c1810,
            #2c1810 5px,
            transparent 5px,
            transparent 10px
          );
        }
      `}</style>
    </div>
  )
}

