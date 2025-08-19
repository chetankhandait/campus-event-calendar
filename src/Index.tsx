"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Filter,
  Search,
  BarChart3,
  History,
  Trash2,
  ArrowRight,
} from "lucide-react"

// Type definitions
type EventCategory = "Academic" | "Sports" | "Cultural" | "Entertainment" | "Social"
type RSVPStatus = "Going" | "Interested" | "Not Going"
type TabValue = "events" | "rsvps" | "stats" | "create"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: EventCategory
  organizer: string
  attendees: string[]
  maxAttendees: number
  createdBy: string
}

interface EventWithRSVP extends Event {
  rsvpStatus: RSVPStatus
}

interface NewEventForm {
  title: string
  description: string
  date: string
  time: string
  location: string
  category: EventCategory
  maxAttendees: number
}

interface RSVPCollection {
  [eventId: string]: RSVPStatus
}

interface CategoryStats {
  total: number
  upcoming: number
  totalAttendees: number
}

interface CategoryStatsCollection {
  [category: string]: CategoryStats
}

interface LandingPageProps {
  onEnterApp: () => void
}

// Dummy data
const initialEvents: Event[] = [
  {
    id: 1,
    title: "Tech Talk: AI in Education",
    description:
      "Join us for an insightful discussion on how artificial intelligence is transforming the educational landscape.",
    date: "2024-01-15",
    time: "14:00",
    location: "Engineering Building, Room 101",
    category: "Academic",
    organizer: "Dr. Sarah Johnson",
    attendees: ["Alice Smith", "Bob Wilson", "Charlie Brown", "Diana Prince"],
    maxAttendees: 50,
    createdBy: "Dr. Sarah Johnson",
  },
  {
    id: 2,
    title: "Basketball Championship Finals",
    description: "Cheer for our campus team in the final match of the season!",
    date: "2024-01-18",
    time: "19:00",
    location: "Sports Complex Arena",
    category: "Sports",
    organizer: "Athletics Department",
    attendees: ["Mike Davis", "Lisa Garcia", "Tom Anderson"],
    maxAttendees: 200,
    createdBy: "Athletics Department",
  },
  {
    id: 3,
    title: "Cultural Night: International Food Festival",
    description: "Experience flavors from around the world prepared by our international student community.",
    date: "2024-01-20",
    time: "18:00",
    location: "Student Union Hall",
    category: "Cultural",
    organizer: "International Student Association",
    attendees: ["Emma Thompson", "James Rodriguez", "Priya Patel", "Ahmed Hassan", "Sophie Chen"],
    maxAttendees: 100,
    createdBy: "International Student Association",
  },
  {
    id: 4,
    title: "Career Fair 2024",
    description: "Meet with top employers and explore internship and job opportunities.",
    date: "2024-01-25",
    time: "10:00",
    location: "Main Campus Quad",
    category: "Academic",
    organizer: "Career Services",
    attendees: ["John Doe", "Jane Smith", "Robert Johnson"],
    maxAttendees: 300,
    createdBy: "Career Services",
  },
  {
    id: 5,
    title: "Spring Concert: Campus Band",
    description: "Enjoy an evening of music performed by our talented campus musicians.",
    date: "2024-01-28",
    time: "20:00",
    location: "Auditorium",
    category: "Entertainment",
    organizer: "Music Department",
    attendees: ["Mary Wilson", "David Lee", "Anna Garcia"],
    maxAttendees: 150,
    createdBy: "Akash Patel",
  },
]

const categories: (string | EventCategory)[] = ["All", "Academic", "Sports", "Cultural", "Entertainment", "Social"]
const rsvpStatuses: RSVPStatus[] = ["Going", "Interested", "Not Going"]

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-4 py-2 text-sm font-medium">
              🎓 Campus Life Made Easy
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Discover Amazing Campus Events
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect with your campus community through exciting events, workshops, and activities. Never miss out on
              what matters to you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={onEnterApp}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Events Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl font-bold">Smart Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Find events tailored to your interests with intelligent filtering and personalized recommendations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl font-bold">Easy RSVP</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                One-click RSVP system with Going, Interested, and Not Going options. Track your commitments
                effortlessly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl font-bold">Create Events</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Organize your own events with our intuitive creation tools. Reach your campus community instantly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl font-bold">Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Track your event participation and discover trending activities across different categories.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Join Thousands of Students</h2>
            <p className="text-muted-foreground text-lg">Making campus life more connected and engaging</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">500+</div>
              <div className="text-muted-foreground font-medium">Active Events</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">10K+</div>
              <div className="text-muted-foreground font-medium">Student Participants</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">50+</div>
              <div className="text-muted-foreground font-medium">Event Categories</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join your campus community today and never miss an amazing event again.
            </p>
          </div>

          <Button
            size="lg"
            onClick={onEnterApp}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Exploring Events
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const CampusEventCalendar: React.FC = () => {
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true)
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [rsvps, setRsvps] = useState<RSVPCollection>({})
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [activeTab, setActiveTab] = useState<TabValue>("events")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [isEventDetailOpen, setIsEventDetailOpen] = useState<boolean>(false)

  const currentUser: string = "Akash Patel"

  // New event form state
  const [newEvent, setNewEvent] = useState<NewEventForm>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Academic",
    maxAttendees: 50,
  })

  // Filter events
  const filteredEvents = useMemo<Event[]>(() => {
    return events.filter((event: Event) => {
      const matchesSearch: boolean =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory: boolean = selectedCategory === "All" || event.category === selectedCategory
      const matchesDate: boolean = !selectedDate || event.date === selectedDate
      return matchesSearch && matchesCategory && matchesDate
    })
  }, [events, searchTerm, selectedCategory, selectedDate])

  // RSVP functions
  const handleRSVP = (eventId: number, status: RSVPStatus): void => {
    setRsvps((prev: RSVPCollection) => ({
      ...prev,
      [eventId.toString()]: status,
    }))
  }

  // Create event
  const handleCreateEvent = (): void => {
    const event: Event = {
      id: events.length + 1,
      ...newEvent,
      organizer: currentUser,
      attendees: [],
      createdBy: currentUser,
    }
    setEvents((prev: Event[]) => [...prev, event])
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "Academic",
      maxAttendees: 50,
    })
    setIsCreateModalOpen(false)
  }

  // Delete event
  const handleDeleteEvent = (eventId: number): void => {
    setEvents((prev: Event[]) => prev.filter((event: Event) => event.id !== eventId))
    setRsvps((prev: RSVPCollection) => {
      const newRsvps = { ...prev }
      delete newRsvps[eventId.toString()]
      return newRsvps
    })
  }

  // Get user's RSVPs
  const userRsvps = useMemo<EventWithRSVP[]>(() => {
    return Object.entries(rsvps)
      .map(([eventId, status]: [string, RSVPStatus]) => {
        const event: Event | undefined = events.find((e: Event) => e.id === parseInt(eventId, 10))
        return event ? { ...event, rsvpStatus: status } : null
      })
      .filter((item): item is EventWithRSVP => item !== null)
  }, [rsvps, events])

  // Get category stats
  const categoryStats = useMemo<CategoryStatsCollection>(() => {
    const stats: CategoryStatsCollection = {}
    categories.slice(1).forEach((category: string | EventCategory) => {
      if (category !== "All") {
        const categoryEvents: Event[] = events.filter((event: Event) => event.category === category)
        stats[category as string] = {
          total: categoryEvents.length,
          upcoming: categoryEvents.filter((event: Event) => new Date(event.date) >= new Date()).length,
          totalAttendees: categoryEvents.reduce((sum: number, event: Event) => sum + event.attendees.length, 0),
        }
      }
    })
    return stats
  }, [events])

  const getCategoryColor = (category: EventCategory): string => {
    const colors: Record<EventCategory, string> = {
      Academic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Sports: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Cultural: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Entertainment: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      Social: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    }
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  const getRsvpColor = (status: RSVPStatus): string => {
    const colors: Record<RSVPStatus, string> = {
      Going: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Interested: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "Not Going": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }
    return colors[status] || ""
  }

  const handleInputChange = (field: keyof NewEventForm) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const value = field === 'maxAttendees' 
        ? parseInt(e.target.value, 10) || 0 
        : e.target.value
      
      setNewEvent((prev: NewEventForm) => ({ 
        ...prev, 
        [field]: value 
      }))
    }

  const handleCategoryChange = (value: string): void => {
    setNewEvent((prev: NewEventForm) => ({ 
      ...prev, 
      category: value as EventCategory 
    }))
  }

  if (showLandingPage) {
    return <LandingPage onEnterApp={() => setShowLandingPage(false)} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Campus Event Calendar</h1>
            <p className="text-muted-foreground">Welcome back, {currentUser}! Discover and join campus events.</p>
          </div>
          <Button variant="outline" onClick={() => setShowLandingPage(true)} className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Home
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as TabValue)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="rsvps" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              My RSVPs
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search Events</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by title or description..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: string | EventCategory) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event: Event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      {event.createdBy === currentUser && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event.attendees.length}/{event.maxAttendees} attendees
                      </div>
                    </div>
                    {rsvps[event.id.toString()] && (
                      <Badge className={getRsvpColor(rsvps[event.id.toString()])}>{rsvps[event.id.toString()]}</Badge>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Dialog
                      open={isEventDetailOpen && selectedEvent?.id === event.id}
                      onOpenChange={(open: boolean) => {
                        setIsEventDetailOpen(open)
                        if (!open) setSelectedEvent(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedEvent(event)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{event.title}</DialogTitle>
                          <DialogDescription>Organized by {event.organizer}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>{event.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div>
                              <strong>Time:</strong> {event.time}
                            </div>
                            <div>
                              <strong>Location:</strong> {event.location}
                            </div>
                            <div>
                              <strong>Category:</strong> {event.category}
                            </div>
                          </div>
                          <div>
                            <strong>
                              Attendees ({event.attendees.length}/{event.maxAttendees}):
                            </strong>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {event.attendees.map((attendee: string, index: number) => (
                                <Badge key={index} variant="secondary">
                                  {attendee}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Select 
                      value={rsvps[event.id.toString()] || ""} 
                      onValueChange={(value: string) => handleRSVP(event.id, value as RSVPStatus)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="RSVP" />
                      </SelectTrigger>
                      <SelectContent>
                        {rsvpStatuses.map((status: RSVPStatus) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* RSVPs Tab */}
          <TabsContent value="rsvps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My RSVP History</CardTitle>
                <CardDescription>Events you've responded to</CardDescription>
              </CardHeader>
              <CardContent>
                {userRsvps.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No RSVPs yet. Start exploring events!</p>
                ) : (
                  <div className="space-y-4">
                    {userRsvps.map((event: EventWithRSVP) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </p>
                        </div>
                        <Badge className={getRsvpColor(event.rsvpStatus)}>{event.rsvpStatus}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categoryStats).map(([category, stats]: [string, CategoryStats]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {category}
                      <Badge className={getCategoryColor(category as EventCategory)}>{stats.total}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Upcoming Events:</span>
                      <span className="font-semibold">{stats.upcoming}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Attendees:</span>
                      <span className="font-semibold">{stats.totalAttendees}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create Event Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
                <CardDescription>Add a new event to the campus calendar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={handleInputChange('title')}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newEvent.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category: string | EventCategory) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={handleInputChange('date')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={handleInputChange('time')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={handleInputChange('location')}
                      placeholder="Enter event location"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAttendees">Max Attendees</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      value={newEvent.maxAttendees.toString()}
                      onChange={handleInputChange('maxAttendees')}
                      min="1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={handleInputChange('description')}
                    placeholder="Enter event description"
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleCreateEvent}
                  disabled={!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location}
                  className="w-full"
                >
                  Create Event
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CampusEventCalendar
