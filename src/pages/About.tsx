import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Users, Award, Target, Globe, TrendingUp, Heart, Shield } from "lucide-react";

const About = () => {
  const stats = [
    { label: "Active Users", value: "15,000+", icon: Users },
    { label: "Datasets", value: "10,234", icon: Database },
    { label: "Downloads", value: "2.5M+", icon: TrendingUp },
    { label: "Competitions", value: "127", icon: Award }
  ];

  const values = [
    {
      icon: Globe,
      title: "Open Access",
      description: "We believe data should be freely accessible to everyone, empowering researchers, students, and organizations across Ghana."
    },
    {
      icon: Shield,
      title: "Data Quality",
      description: "Every dataset is reviewed for accuracy and completeness, ensuring you can trust the data you work with."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by data enthusiasts, for data enthusiasts. Our community shapes the platform through contributions and feedback."
    },
    {
      icon: Heart,
      title: "Social Impact",
      description: "We focus on datasets that can drive positive change and help solve Ghana's most pressing challenges."
    }
  ];

  const team = [
    {
      name: "Dr. Kwame Mensah",
      role: "Founder & CEO",
      description: "PhD in Computer Science, former World Bank data analyst with 15 years of experience in open data initiatives."
    },
    {
      name: "Abena Osei",
      role: "Head of Data Curation",
      description: "MSc in Statistics, previously led data quality initiatives at Ghana Statistical Service."
    },
    {
      name: "Kofi Asante",
      role: "Community Manager",
      description: "Data science educator and community builder, passionate about democratizing data access."
    },
    {
      name: "Ama Darko",
      role: "Technical Lead",
      description: "Full-stack engineer with expertise in data platforms and machine learning infrastructure."
    }
  ];

  const milestones = [
    { year: "2021", event: "Platform Launch", description: "GH DataHub officially launched with 100 datasets" },
    { year: "2022", event: "1,000 Datasets", description: "Reached our first major milestone of 1,000 curated datasets" },
    { year: "2023", event: "Competition Platform", description: "Launched data science competitions with GH₵500,000 in prizes" },
    { year: "2024", event: "10,000+ Datasets", description: "Now the largest open data repository in West Africa" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-b border-border py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">
                Empowering Ghana Through Open Data
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                GH DataHub is Ghana's premier open data platform, connecting researchers, data scientists, 
                and organizations with high-quality datasets to drive innovation and social impact.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg">Join Our Community</Button>
                <Button size="lg" variant="outline">Contact Us</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
                <p className="text-xl text-muted-foreground">
                  To democratize access to Ghana's data ecosystem and foster a thriving community 
                  of data scientists, researchers, and innovators working together to solve our nation's challenges.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <CardTitle>{value.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {value.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-center">Our Story</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground mb-6">
                  GH DataHub was born from a simple observation: Ghana has a wealth of valuable data, 
                  but it was scattered, inaccessible, and underutilized. In 2021, a group of data scientists, 
                  researchers, and civic technologists came together with a vision to change this.
                </p>
                <p className="text-muted-foreground mb-6">
                  We started by aggregating datasets from government agencies, research institutions, and NGOs. 
                  What began as a small repository of 100 datasets has grown into West Africa's largest open data 
                  platform, with over 10,000 datasets and a thriving community of 15,000+ users.
                </p>
                <p className="text-muted-foreground">
                  Today, GH DataHub powers research at universities, informs policy decisions in government, 
                  and enables data scientists to compete in solving real-world challenges. Our platform has 
                  become the go-to resource for anyone working with Ghanaian data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center">Key Milestones</h2>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        {milestone.year.slice(2)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{milestone.event}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold mb-4 text-center">Our Team</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                A passionate group of data professionals dedicated to making Ghana's data more accessible
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="flex justify-center mb-4">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription className="font-semibold text-primary">
                        {member.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{member.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-4">Our Partners</h2>
              <p className="text-muted-foreground mb-8">
                We collaborate with leading organizations to bring you the best data
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                {["Ghana Statistical Service", "Ministry of Agriculture", "Ghana Health Service", "Bank of Ghana", 
                  "Energy Commission", "Ghana Education Service", "Urban Roads Dept", "World Bank Ghana"].map((partner, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium">{partner}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Be part of Ghana's data revolution. Share your datasets, participate in competitions, 
                and collaborate with thousands of data enthusiasts.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg">Get Started Free</Button>
                <Button size="lg" variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
