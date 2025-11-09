import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Eye, Download, Share2, ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const NotebookDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    {
      id: "1",
      author: "Ama Kofi",
      avatar: "",
      content: "Great tutorial! The explanations are very clear and the code examples are practical.",
      timestamp: "2 hours ago",
      likes: 12
    },
    {
      id: "2",
      author: "Kwesi Boateng",
      avatar: "",
      content: "I implemented this in my project and it worked perfectly. Thanks for sharing!",
      timestamp: "5 hours ago",
      likes: 8
    },
    {
      id: "3",
      author: "Abena Mensah",
      avatar: "",
      content: "Could you add more examples on handling edge cases? Otherwise, excellent work!",
      timestamp: "1 day ago",
      likes: 5
    }
  ]);

  // Course content database
  const notebookContent: Record<string, any> = {
    "1": {
      title: "Introduction to Machine Learning",
      author: "Dr. Kwame Mensah",
      description: "Complete beginner's guide to ML concepts, algorithms, and implementation from scratch.",
      likes: 567,
      comments: 89,
      views: 8921,
      tags: ["Tutorial", "Machine Learning", "Beginner"],
      language: "Python",
      featured: true,
      content: `# Introduction to Machine Learning

## Course Overview
This comprehensive tutorial covers fundamental machine learning concepts and practical implementation.

## Chapter 1: What is Machine Learning?
Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.

### Types of Machine Learning:
1. **Supervised Learning** - Learning from labeled data
2. **Unsupervised Learning** - Finding patterns in unlabeled data
3. **Reinforcement Learning** - Learning through trial and error

## Chapter 2: Setting Up Your Environment

\`\`\`python
# Install required libraries
pip install numpy pandas scikit-learn matplotlib seaborn

# Import essential libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
\`\`\`

## Chapter 3: Linear Regression Example

\`\`\`python
# Load sample dataset
from sklearn.datasets import load_boston
X, y = load_boston(return_X_y=True)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate
print(f"R² Score: {r2_score(y_test, y_pred):.4f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}")
\`\`\`

## Chapter 4: Classification with Decision Trees

\`\`\`python
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.metrics import accuracy_score, classification_report

# Load iris dataset
iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.3, random_state=42
)

# Train classifier
clf = DecisionTreeClassifier(max_depth=3)
clf.fit(X_train, y_train)

# Predict and evaluate
y_pred = clf.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred))
\`\`\`

## Key Takeaways
- ML enables computers to learn from data
- Start with simple algorithms like Linear Regression
- Always split your data into training and testing sets
- Evaluate models using appropriate metrics
`,
    },
    "2": {
      title: "Deep Learning Fundamentals with PyTorch",
      author: "Ama Osei",
      description: "Step-by-step tutorial on neural networks, CNNs, and RNNs using PyTorch framework.",
      likes: 489,
      comments: 72,
      views: 7156,
      tags: ["Tutorial", "AI", "Deep Learning", "PyTorch"],
      language: "Python",
      featured: true,
      content: `# Deep Learning with PyTorch

## Introduction
Learn to build neural networks from scratch using PyTorch, one of the most popular deep learning frameworks.

## Chapter 1: PyTorch Basics

\`\`\`python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

# Check if GPU is available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Create tensors
x = torch.tensor([[1, 2], [3, 4], [5, 6]], dtype=torch.float32)
y = torch.tensor([[2], [4], [6]], dtype=torch.float32)

print(f"Shape of x: {x.shape}")
print(f"Shape of y: {y.shape}")
\`\`\`

## Chapter 2: Building Your First Neural Network

\`\`\`python
class SimpleNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(SimpleNN, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, output_size)
    
    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x

# Initialize model
model = SimpleNN(input_size=10, hidden_size=20, output_size=1)
model = model.to(device)

# Loss and optimizer
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)
\`\`\`

## Chapter 3: Training Loop

\`\`\`python
def train(model, train_loader, criterion, optimizer, epochs=10):
    model.train()
    for epoch in range(epochs):
        total_loss = 0
        for batch_x, batch_y in train_loader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            
            # Forward pass
            outputs = model(batch_x)
            loss = criterion(outputs, batch_y)
            
            # Backward pass
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
        
        print(f"Epoch [{epoch+1}/{epochs}], Loss: {total_loss/len(train_loader):.4f}")
\`\`\`

## Chapter 4: Convolutional Neural Networks (CNN)

\`\`\`python
class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, 10)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.5)
    
    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = x.view(-1, 64 * 7 * 7)
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

# Initialize CNN for MNIST
cnn_model = CNN().to(device)
\`\`\`

## Practice Exercises
1. Build a network to classify MNIST digits
2. Implement data augmentation
3. Add batch normalization to improve training
4. Experiment with different optimizers
`,
    },
    "3": {
      title: "Data Science with Python - Complete Course",
      author: "Kofi Addo",
      description: "Comprehensive data science tutorial covering pandas, numpy, matplotlib, and scikit-learn.",
      likes: 723,
      comments: 156,
      views: 12876,
      tags: ["Tutorial", "Data Science", "Python"],
      language: "Python",
      featured: true,
      content: `# Data Science with Python - Complete Course

## Module 1: NumPy Fundamentals

\`\`\`python
import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

# Array operations
print(f"Mean: {arr.mean()}")
print(f"Std: {arr.std()}")
print(f"Sum: {arr.sum()}")

# Broadcasting
arr2 = arr * 2  # Element-wise multiplication
print(f"Doubled: {arr2}")

# Indexing and slicing
print(f"First two elements: {arr[:2]}")
print(f"Matrix first row: {matrix[0, :]}")
\`\`\`

## Module 2: Pandas for Data Manipulation

\`\`\`python
import pandas as pd

# Create DataFrame
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'David'],
    'age': [25, 30, 35, 28],
    'city': ['Accra', 'Kumasi', 'Takoradi', 'Tamale'],
    'salary': [50000, 60000, 75000, 55000]
}
df = pd.DataFrame(data)

# Basic operations
print(df.head())
print(df.describe())
print(df.info())

# Filtering
high_earners = df[df['salary'] > 55000]
print(high_earners)

# Grouping
city_avg_salary = df.groupby('city')['salary'].mean()
print(city_avg_salary)

# Adding new columns
df['salary_in_k'] = df['salary'] / 1000
df['age_group'] = pd.cut(df['age'], bins=[0, 25, 30, 100], labels=['Young', 'Mid', 'Senior'])

# Handling missing data
df_with_nan = df.copy()
df_with_nan.loc[0, 'salary'] = np.nan
df_filled = df_with_nan.fillna(df_with_nan['salary'].mean())
\`\`\`

## Module 3: Data Visualization with Matplotlib & Seaborn

\`\`\`python
import matplotlib.pyplot as plt
import seaborn as sns

# Set style
sns.set_style("whitegrid")

# Line plot
plt.figure(figsize=(10, 6))
plt.plot([1, 2, 3, 4, 5], [10, 20, 15, 25, 30], marker='o')
plt.title('Sample Line Plot')
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.show()

# Bar plot
plt.figure(figsize=(10, 6))
df.plot(x='name', y='salary', kind='bar', color='skyblue')
plt.title('Salary by Person')
plt.ylabel('Salary (GHS)')
plt.xticks(rotation=45)
plt.show()

# Scatter plot with seaborn
plt.figure(figsize=(10, 6))
sns.scatterplot(data=df, x='age', y='salary', hue='city', s=100)
plt.title('Age vs Salary by City')
plt.show()

# Heatmap
correlation = df[['age', 'salary']].corr()
sns.heatmap(correlation, annot=True, cmap='coolwarm')
plt.title('Correlation Matrix')
plt.show()
\`\`\`

## Module 4: Statistical Analysis

\`\`\`python
from scipy import stats

# Generate sample data
np.random.seed(42)
data1 = np.random.normal(100, 15, 100)
data2 = np.random.normal(105, 15, 100)

# T-test
t_stat, p_value = stats.ttest_ind(data1, data2)
print(f"T-statistic: {t_stat:.4f}")
print(f"P-value: {p_value:.4f}")

# Correlation
correlation, p_val = stats.pearsonr(df['age'], df['salary'])
print(f"Correlation: {correlation:.4f}")

# Linear regression
from scipy.stats import linregress
slope, intercept, r_value, p_value, std_err = linregress(df['age'], df['salary'])
print(f"Slope: {slope:.2f}, R-squared: {r_value**2:.4f}")
\`\`\`

## Projects to Practice
1. Analyze a CSV dataset of your choice
2. Create a comprehensive EDA report
3. Build visualizations dashboard
4. Perform hypothesis testing on real data
`,
    },
    "4": {
      title: "Natural Language Processing Tutorial",
      author: "Abena Frimpong",
      description: "Learn NLP from basics to advanced: tokenization, sentiment analysis, and transformers.",
      likes: 401,
      comments: 64,
      views: 5543,
      tags: ["Tutorial", "AI", "NLP", "Machine Learning"],
      language: "Python",
      featured: true,
      content: `# Natural Language Processing Tutorial

## Introduction to NLP
Learn to process and analyze text data using modern NLP techniques.

## Chapter 1: Text Preprocessing

\`\`\`python
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer
import re

# Download required resources
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

text = "Natural Language Processing is amazing! It helps computers understand human language."

# Tokenization
words = word_tokenize(text)
sentences = sent_tokenize(text)
print(f"Words: {words}")
print(f"Sentences: {sentences}")

# Remove punctuation and lowercase
cleaned_text = re.sub(r'[^\w\s]', '', text.lower())
print(f"Cleaned: {cleaned_text}")

# Remove stopwords
stop_words = set(stopwords.words('english'))
filtered_words = [w for w in words if w.lower() not in stop_words]
print(f"Filtered: {filtered_words}")

# Stemming and Lemmatization
stemmer = PorterStemmer()
lemmatizer = WordNetLemmatizer()

stemmed = [stemmer.stem(w) for w in filtered_words]
lemmatized = [lemmatizer.lemmatize(w) for w in filtered_words]
print(f"Stemmed: {stemmed}")
print(f"Lemmatized: {lemmatized}")
\`\`\`

## Chapter 2: Sentiment Analysis

\`\`\`python
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# TextBlob sentiment
text1 = "I love this product! It's amazing and works perfectly."
text2 = "This is terrible. I hate it and want my money back."

blob1 = TextBlob(text1)
blob2 = TextBlob(text2)

print(f"Text 1 sentiment: {blob1.sentiment}")
print(f"Text 2 sentiment: {blob2.sentiment}")

# VADER sentiment (better for social media)
analyzer = SentimentIntensityAnalyzer()
scores1 = analyzer.polarity_scores(text1)
scores2 = analyzer.polarity_scores(text2)

print(f"Text 1 VADER: {scores1}")
print(f"Text 2 VADER: {scores2}")
\`\`\`

## Chapter 3: Feature Extraction

\`\`\`python
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

documents = [
    "Machine learning is a subset of artificial intelligence",
    "Deep learning is a type of machine learning",
    "Natural language processing uses machine learning"
]

# Bag of Words
vectorizer = CountVectorizer()
bow_matrix = vectorizer.fit_transform(documents)
print(f"Vocabulary: {vectorizer.get_feature_names_out()}")
print(f"BoW Matrix:\n{bow_matrix.toarray()}")

# TF-IDF
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(documents)
print(f"TF-IDF Matrix:\n{tfidf_matrix.toarray()}")
\`\`\`

## Chapter 4: Text Classification

\`\`\`python
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score

# Sample data
texts = [
    "Great product, highly recommend",
    "Terrible quality, waste of money",
    "Amazing service and fast delivery",
    "Poor customer support, disappointed",
    "Love it! Best purchase ever",
    "Not worth the price, very bad"
]
labels = [1, 0, 1, 0, 1, 0]  # 1: positive, 0: negative

# Vectorize
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)
y = labels

# Train classifier
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
classifier = MultinomialNB()
classifier.fit(X_train, y_train)

# Predict
y_pred = classifier.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred))
\`\`\`

## Chapter 5: Introduction to Transformers

\`\`\`python
from transformers import pipeline

# Sentiment analysis with pre-trained model
sentiment_pipeline = pipeline("sentiment-analysis")
result = sentiment_pipeline("I absolutely love this tutorial!")
print(result)

# Text generation
generator = pipeline("text-generation", model="gpt2")
generated = generator("Machine learning is", max_length=50, num_return_sequences=1)
print(generated)

# Named Entity Recognition
ner_pipeline = pipeline("ner", grouped_entities=True)
text = "Apple Inc. was founded by Steve Jobs in Cupertino, California."
entities = ner_pipeline(text)
print(entities)
\`\`\`

## Practice Projects
1. Build a spam email classifier
2. Create a chatbot using NLTK
3. Implement sentiment analysis on Twitter data
4. Build a text summarization tool
`,
    },
    "5": {
      title: "Computer Vision with TensorFlow",
      author: "Yaw Boateng",
      description: "Master image classification, object detection, and segmentation with hands-on projects.",
      likes: 534,
      comments: 98,
      views: 9654,
      tags: ["Tutorial", "AI", "Computer Vision", "TensorFlow"],
      language: "Python",
      featured: true,
      content: `# Computer Vision with TensorFlow

## Introduction
Learn to build powerful computer vision models using TensorFlow and Keras.

## Chapter 1: Image Basics

\`\`\`python
import tensorflow as tf
from tensorflow import keras
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

# Load and display image
img = Image.open('sample_image.jpg')
img_array = np.array(img)
print(f"Image shape: {img_array.shape}")

plt.imshow(img_array)
plt.title("Original Image")
plt.axis('off')
plt.show()

# Image preprocessing
img_resized = tf.image.resize(img_array, [224, 224])
img_normalized = img_resized / 255.0
print(f"Normalized shape: {img_normalized.shape}")
\`\`\`

## Chapter 2: Building a CNN Classifier

\`\`\`python
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import cifar10

# Load CIFAR-10 dataset
(X_train, y_train), (X_test, y_test) = cifar10.load_data()
X_train = X_train / 255.0
X_test = X_test / 255.0

# Build CNN model
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(32, 32, 3)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

model.summary()

# Compile model
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Train model
history = model.fit(
    X_train, y_train,
    epochs=10,
    validation_data=(X_test, y_test),
    batch_size=64
)
\`\`\`

## Chapter 3: Transfer Learning

\`\`\`python
from tensorflow.keras.applications import VGG16, ResNet50
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import preprocess_input

# Load pre-trained model
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Freeze base model
base_model.trainable = False

# Add custom layers
model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Fine-tuning
# Unfreeze last few layers
base_model.trainable = True
for layer in base_model.layers[:-4]:
    layer.trainable = False
\`\`\`

## Chapter 4: Image Augmentation

\`\`\`python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Create data generator with augmentation
datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    zoom_range=0.2,
    shear_range=0.2,
    fill_mode='nearest'
)

# Generate augmented images
train_generator = datagen.flow(X_train, y_train, batch_size=32)

# Train with augmented data
model.fit(train_generator, epochs=10, validation_data=(X_test, y_test))
\`\`\`

## Chapter 5: Object Detection Basics

\`\`\`python
import cv2

# Load pre-trained YOLO model
net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
classes = []
with open("coco.names", "r") as f:
    classes = [line.strip() for line in f.readlines()]

# Load image
img = cv2.imread("image.jpg")
height, width, _ = img.shape

# Prepare image for YOLO
blob = cv2.dnn.blobFromImage(img, 1/255.0, (416, 416), swapRB=True, crop=False)
net.setInput(blob)

# Get detections
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]
outputs = net.forward(output_layers)

# Process detections
boxes = []
confidences = []
class_ids = []

for output in outputs:
    for detection in output:
        scores = detection[5:]
        class_id = np.argmax(scores)
        confidence = scores[class_id]
        
        if confidence > 0.5:
            center_x = int(detection[0] * width)
            center_y = int(detection[1] * height)
            w = int(detection[2] * width)
            h = int(detection[3] * height)
            
            x = int(center_x - w/2)
            y = int(center_y - h/2)
            
            boxes.append([x, y, w, h])
            confidences.append(float(confidence))
            class_ids.append(class_id)
\`\`\`

## Projects to Build
1. Image classifier for custom dataset
2. Face detection and recognition system
3. Object detection in videos
4. Image segmentation for medical imaging
`,
    },
    "6": {
      title: "Statistical Learning for Data Science",
      author: "Efua Asare",
      description: "Essential statistics tutorial: hypothesis testing, regression, and probability theory.",
      likes: 298,
      comments: 45,
      views: 4432,
      tags: ["Tutorial", "Data Science", "Statistics"],
      language: "R",
      featured: false,
      content: `# Statistical Learning for Data Science

## Module 1: Descriptive Statistics

\`\`\`r
# Load libraries
library(tidyverse)
library(ggplot2)

# Create sample data
data <- data.frame(
  age = c(23, 45, 32, 56, 28, 41, 35, 29, 52, 38),
  salary = c(45000, 75000, 58000, 95000, 48000, 72000, 62000, 51000, 88000, 65000)
)

# Measures of central tendency
mean_age <- mean(data$age)
median_age <- median(data$age)
mode_salary <- as.numeric(names(sort(table(data$salary), decreasing = TRUE)[1]))

cat("Mean Age:", mean_age, "\n")
cat("Median Age:", median_age, "\n")

# Measures of dispersion
sd_salary <- sd(data$salary)
var_salary <- var(data$salary)
range_salary <- range(data$salary)

cat("Standard Deviation of Salary:", sd_salary, "\n")
cat("Variance of Salary:", var_salary, "\n")
cat("Range of Salary:", range_salary, "\n")

# Summary statistics
summary(data)
\`\`\`

## Module 2: Probability Distributions

\`\`\`r
# Normal Distribution
x <- seq(-4, 4, length=100)
y <- dnorm(x, mean=0, sd=1)

plot(x, y, type="l", lwd=2, col="blue",
     main="Standard Normal Distribution",
     xlab="Z-score", ylab="Density")

# Calculate probabilities
p_less_than_1 <- pnorm(1, mean=0, sd=1)
p_between <- pnorm(1) - pnorm(-1)

cat("P(Z < 1):", p_less_than_1, "\n")
cat("P(-1 < Z < 1):", p_between, "\n")

# Binomial Distribution
n <- 10  # number of trials
p <- 0.5  # probability of success

binom_probs <- dbinom(0:n, size=n, prob=p)
barplot(binom_probs, names.arg=0:n,
        main="Binomial Distribution (n=10, p=0.5)",
        xlab="Number of Successes", ylab="Probability")
\`\`\`

## Module 3: Hypothesis Testing

\`\`\`r
# One-sample t-test
sample_data <- c(23, 25, 28, 22, 24, 26, 27, 23, 25, 24)
mu_0 <- 20  # hypothesized population mean

t_test_result <- t.test(sample_data, mu=mu_0)
print(t_test_result)

# Two-sample t-test
group1 <- c(85, 88, 90, 87, 86, 89, 91, 84)
group2 <- c(78, 80, 82, 79, 81, 77, 83, 80)

two_sample_test <- t.test(group1, group2)
print(two_sample_test)

# Chi-square test
observed <- matrix(c(50, 30, 20, 45, 35, 25), nrow=2, byrow=TRUE)
chi_test <- chisq.test(observed)
print(chi_test)

# ANOVA
groups <- data.frame(
  score = c(85, 88, 90, 78, 80, 82, 92, 95, 94),
  group = factor(c(rep("A", 3), rep("B", 3), rep("C", 3)))
)

anova_result <- aov(score ~ group, data=groups)
summary(anova_result)
\`\`\`

## Module 4: Regression Analysis

\`\`\`r
# Simple Linear Regression
data <- data.frame(
  hours_studied = c(2, 3, 4, 5, 6, 7, 8, 9, 10, 11),
  test_score = c(55, 60, 65, 70, 75, 80, 85, 88, 92, 95)
)

# Fit model
model <- lm(test_score ~ hours_studied, data=data)
summary(model)

# Plot with regression line
plot(data$hours_studied, data$test_score,
     main="Hours Studied vs Test Score",
     xlab="Hours Studied", ylab="Test Score",
     pch=19, col="blue")
abline(model, col="red", lwd=2)

# Predictions
new_data <- data.frame(hours_studied=c(5.5, 8.5))
predictions <- predict(model, new_data, interval="confidence")
print(predictions)

# Multiple Linear Regression
mtcars_model <- lm(mpg ~ wt + hp + cyl, data=mtcars)
summary(mtcars_model)

# Check assumptions
par(mfrow=c(2,2))
plot(mtcars_model)
\`\`\`

## Module 5: Correlation and Covariance

\`\`\`r
# Pearson correlation
cor_test <- cor.test(mtcars$mpg, mtcars$wt)
print(cor_test)

# Correlation matrix
cor_matrix <- cor(mtcars[, c("mpg", "wt", "hp", "qsec")])
print(cor_matrix)

# Visualize correlation matrix
library(corrplot)
corrplot(cor_matrix, method="circle", type="upper",
         tl.col="black", tl.srt=45)

# Covariance
cov_matrix <- cov(mtcars[, c("mpg", "wt", "hp")])
print(cov_matrix)
\`\`\`

## Practice Exercises
1. Conduct hypothesis tests on real datasets
2. Build and validate regression models
3. Analyze correlation patterns
4. Perform power analysis for sample size determination
`,
    },
    "7": {
      title: "Time Series Forecasting with ARIMA and LSTM",
      author: "Kwabena Owusu",
      description: "Complete guide to time series analysis using classical and deep learning methods.",
      likes: 376,
      comments: 58,
      views: 6234,
      tags: ["Tutorial", "Machine Learning", "Time Series"],
      language: "Python",
      featured: false,
      content: `# Time Series Forecasting

## Introduction
Master time series analysis using both classical statistical methods and modern deep learning approaches.

## Chapter 1: Time Series Basics

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

# Create sample time series
dates = pd.date_range('2020-01-01', periods=365, freq='D')
values = np.sin(np.arange(365) * 2 * np.pi / 365) + np.random.randn(365) * 0.1
ts = pd.Series(values, index=dates)

# Plot time series
plt.figure(figsize=(12, 4))
ts.plot()
plt.title('Sample Time Series')
plt.xlabel('Date')
plt.ylabel('Value')
plt.show()

# Decomposition
decomposition = seasonal_decompose(ts, model='additive', period=30)
fig = decomposition.plot()
plt.show()
\`\`\`

## Chapter 2: Stationarity Testing

\`\`\`python
from statsmodels.tsa.stattools import adfuller, kpss

# Augmented Dickey-Fuller test
def adf_test(series):
    result = adfuller(series)
    print('ADF Statistic:', result[0])
    print('p-value:', result[1])
    print('Critical Values:')
    for key, value in result[4].items():
        print(f'   {key}: {value}')
    
    if result[1] <= 0.05:
        print("Series is stationary")
    else:
        print("Series is non-stationary")

adf_test(ts)

# Make series stationary
ts_diff = ts.diff().dropna()
adf_test(ts_diff)

# Plot ACF and PACF
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
plot_acf(ts_diff, ax=axes[0], lags=40)
plot_pacf(ts_diff, ax=axes[1], lags=40)
plt.show()
\`\`\`

## Chapter 3: ARIMA Modeling

\`\`\`python
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_squared_error, mean_absolute_error

# Split data
train_size = int(len(ts) * 0.8)
train, test = ts[:train_size], ts[train_size:]

# Fit ARIMA model
model = ARIMA(train, order=(1, 1, 1))
fitted_model = model.fit()
print(fitted_model.summary())

# Make predictions
predictions = fitted_model.forecast(steps=len(test))

# Evaluate
mse = mean_squared_error(test, predictions)
mae = mean_absolute_error(test, predictions)
rmse = np.sqrt(mse)

print(f'RMSE: {rmse:.4f}')
print(f'MAE: {mae:.4f}')

# Plot results
plt.figure(figsize=(12, 6))
plt.plot(train.index, train, label='Training Data')
plt.plot(test.index, test, label='Actual')
plt.plot(test.index, predictions, label='Predicted', color='red')
plt.legend()
plt.title('ARIMA Forecast')
plt.show()
\`\`\`

## Chapter 4: SARIMA for Seasonal Data

\`\`\`python
from statsmodels.tsa.statespace.sarimax import SARIMAX

# Fit SARIMA model
sarima_model = SARIMAX(train, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
sarima_fitted = sarima_model.fit()

# Forecast
sarima_predictions = sarima_fitted.forecast(steps=len(test))

# Evaluate
sarima_rmse = np.sqrt(mean_squared_error(test, sarima_predictions))
print(f'SARIMA RMSE: {sarima_rmse:.4f}')
\`\`\`

## Chapter 5: LSTM for Time Series

\`\`\`python
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler

# Prepare data for LSTM
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(ts.values.reshape(-1, 1))

def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length])
        y.append(data[i+seq_length])
    return np.array(X), np.array(y)

seq_length = 30
X, y = create_sequences(scaled_data, seq_length)

# Split data
train_size = int(len(X) * 0.8)
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

# Build LSTM model
model = Sequential([
    LSTM(50, activation='relu', return_sequences=True, input_shape=(seq_length, 1)),
    Dropout(0.2),
    LSTM(50, activation='relu'),
    Dropout(0.2),
    Dense(1)
])

model.compile(optimizer='adam', loss='mse')

# Train model
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_split=0.1,
    verbose=1
)

# Make predictions
lstm_predictions = model.predict(X_test)
lstm_predictions = scaler.inverse_transform(lstm_predictions)
y_test_inv = scaler.inverse_transform(y_test)

# Evaluate
lstm_rmse = np.sqrt(mean_squared_error(y_test_inv, lstm_predictions))
print(f'LSTM RMSE: {lstm_rmse:.4f}')

# Plot
plt.figure(figsize=(12, 6))
plt.plot(y_test_inv, label='Actual')
plt.plot(lstm_predictions, label='LSTM Predicted')
plt.legend()
plt.title('LSTM Time Series Forecast')
plt.show()
\`\`\`

## Projects to Practice
1. Forecast stock prices
2. Predict energy consumption
3. Analyze seasonal sales data
4. Build a weather forecasting model
`,
    },
    "8": {
      title: "Reinforcement Learning Basics",
      author: "Akosua Sarpong",
      description: "Introduction to RL concepts: Q-learning, policy gradients, and practical applications.",
      likes: 445,
      comments: 71,
      views: 7821,
      tags: ["Tutorial", "AI", "Reinforcement Learning"],
      language: "Python",
      featured: false,
      content: `# Reinforcement Learning Basics

## Introduction
Learn the fundamentals of reinforcement learning and build intelligent agents.

## Chapter 1: RL Fundamentals

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Simple environment: GridWorld
class GridWorld:
    def __init__(self, size=5):
        self.size = size
        self.state = (0, 0)
        self.goal = (size-1, size-1)
    
    def reset(self):
        self.state = (0, 0)
        return self.state
    
    def step(self, action):
        # Actions: 0=up, 1=right, 2=down, 3=left
        x, y = self.state
        
        if action == 0 and x > 0:
            x -= 1
        elif action == 1 and y < self.size - 1:
            y += 1
        elif action == 2 and x < self.size - 1:
            x += 1
        elif action == 3 and y > 0:
            y -= 1
        
        self.state = (x, y)
        reward = 1 if self.state == self.goal else -0.1
        done = self.state == self.goal
        
        return self.state, reward, done

env = GridWorld()
state = env.reset()
print(f"Initial state: {state}")

# Take random actions
for _ in range(5):
    action = np.random.randint(0, 4)
    state, reward, done = env.step(action)
    print(f"State: {state}, Reward: {reward}, Done: {done}")
\`\`\`

## Chapter 2: Q-Learning Algorithm

\`\`\`python
class QLearningAgent:
    def __init__(self, env, alpha=0.1, gamma=0.99, epsilon=0.1):
        self.env = env
        self.alpha = alpha  # learning rate
        self.gamma = gamma  # discount factor
        self.epsilon = epsilon  # exploration rate
        
        # Initialize Q-table
        self.q_table = {}
    
    def get_q_value(self, state, action):
        return self.q_table.get((state, action), 0.0)
    
    def choose_action(self, state):
        # Epsilon-greedy policy
        if np.random.random() < self.epsilon:
            return np.random.randint(0, 4)  # Random action
        else:
            # Choose best action
            q_values = [self.get_q_value(state, a) for a in range(4)]
            return np.argmax(q_values)
    
    def update(self, state, action, reward, next_state):
        # Q-learning update rule
        old_q = self.get_q_value(state, action)
        next_max_q = max([self.get_q_value(next_state, a) for a in range(4)])
        new_q = old_q + self.alpha * (reward + self.gamma * next_max_q - old_q)
        self.q_table[(state, action)] = new_q
    
    def train(self, episodes=1000):
        rewards_per_episode = []
        
        for episode in range(episodes):
            state = self.env.reset()
            total_reward = 0
            done = False
            
            while not done:
                action = self.choose_action(state)
                next_state, reward, done = self.env.step(action)
                self.update(state, action, reward, next_state)
                state = next_state
                total_reward += reward
            
            rewards_per_episode.append(total_reward)
            
            if episode % 100 == 0:
                avg_reward = np.mean(rewards_per_episode[-100:])
                print(f"Episode {episode}, Avg Reward: {avg_reward:.2f}")
        
        return rewards_per_episode

# Train agent
agent = QLearningAgent(GridWorld())
rewards = agent.train(episodes=1000)

# Plot learning curve
plt.figure(figsize=(10, 6))
plt.plot(rewards)
plt.title('Q-Learning Training Progress')
plt.xlabel('Episode')
plt.ylabel('Total Reward')
plt.show()
\`\`\`

## Chapter 3: Deep Q-Network (DQN)

\`\`\`python
import tensorflow as tf
from tensorflow.keras import layers, models
from collections import deque
import random

class DQNAgent:
    def __init__(self, state_size, action_size):
        self.state_size = state_size
        self.action_size = action_size
        self.memory = deque(maxlen=2000)
        self.gamma = 0.95
        self.epsilon = 1.0
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995
        self.learning_rate = 0.001
        self.model = self._build_model()
    
    def _build_model(self):
        model = models.Sequential([
            layers.Dense(24, input_dim=self.state_size, activation='relu'),
            layers.Dense(24, activation='relu'),
            layers.Dense(self.action_size, activation='linear')
        ])
        model.compile(loss='mse', optimizer=tf.keras.optimizers.Adam(lr=self.learning_rate))
        return model
    
    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))
    
    def act(self, state):
        if np.random.rand() <= self.epsilon:
            return random.randrange(self.action_size)
        q_values = self.model.predict(state, verbose=0)
        return np.argmax(q_values[0])
    
    def replay(self, batch_size):
        if len(self.memory) < batch_size:
            return
        
        minibatch = random.sample(self.memory, batch_size)
        
        for state, action, reward, next_state, done in minibatch:
            target = reward
            if not done:
                target = reward + self.gamma * np.amax(self.model.predict(next_state, verbose=0)[0])
            
            target_f = self.model.predict(state, verbose=0)
            target_f[0][action] = target
            self.model.fit(state, target_f, epochs=1, verbose=0)
        
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay

# Example usage with CartPole
import gym
env = gym.make('CartPole-v1')
state_size = env.observation_space.shape[0]
action_size = env.action_space.n

dqn_agent = DQNAgent(state_size, action_size)

episodes = 100
for e in range(episodes):
    state = env.reset()
    state = np.reshape(state, [1, state_size])
    
    for time in range(500):
        action = dqn_agent.act(state)
        next_state, reward, done, _ = env.step(action)
        next_state = np.reshape(next_state, [1, state_size])
        
        dqn_agent.remember(state, action, reward, next_state, done)
        state = next_state
        
        if done:
            print(f"Episode: {e+1}/{episodes}, Score: {time}")
            break
    
    dqn_agent.replay(32)
\`\`\`

## Chapter 4: Policy Gradient Methods

\`\`\`python
class PolicyGradientAgent:
    def __init__(self, state_size, action_size):
        self.state_size = state_size
        self.action_size = action_size
        self.gamma = 0.99
        self.learning_rate = 0.01
        
        self.states = []
        self.actions = []
        self.rewards = []
        
        self.model = self._build_model()
    
    def _build_model(self):
        model = models.Sequential([
            layers.Dense(24, input_dim=self.state_size, activation='relu'),
            layers.Dense(24, activation='relu'),
            layers.Dense(self.action_size, activation='softmax')
        ])
        return model
    
    def act(self, state):
        state = np.reshape(state, [1, self.state_size])
        probs = self.model.predict(state, verbose=0)[0]
        action = np.random.choice(self.action_size, p=probs)
        return action
    
    def remember(self, state, action, reward):
        self.states.append(state)
        self.actions.append(action)
        self.rewards.append(reward)
    
    def discount_rewards(self):
        discounted = np.zeros_like(self.rewards, dtype=np.float32)
        running_add = 0
        for t in reversed(range(len(self.rewards))):
            running_add = running_add * self.gamma + self.rewards[t]
            discounted[t] = running_add
        
        # Normalize
        discounted -= np.mean(discounted)
        discounted /= np.std(discounted)
        return discounted
    
    def train(self):
        discounted_rewards = self.discount_rewards()
        
        states = np.vstack(self.states)
        actions = np.array(self.actions)
        
        # Train the model
        # Implementation of policy gradient update
        
        # Clear memory
        self.states = []
        self.actions = []
        self.rewards = []
\`\`\`

## Practice Projects
1. Train an agent to play Atari games
2. Build a trading bot using RL
3. Implement multi-armed bandit solutions
4. Create a robot navigation system
`,
    },
  };

  const notebook = notebookContent[id || "1"] || notebookContent["1"];

  const handleLike = () => {
    toast({
      title: "Liked!",
      description: "Added to your favorites",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloading notebook",
      description: "Your download will start shortly",
    });
  };

  const handleShare = () => {
    toast({
      title: "Link copied",
      description: "Notebook link copied to clipboard",
    });
  };

  const handlePostComment = () => {
    if (!commentText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return;
    }

    const newComment = {
      id: String(comments.length + 1),
      author: "Current User",
      avatar: "",
      content: commentText,
      timestamp: "Just now",
      likes: 0
    };

    setComments([newComment, ...comments]);
    setCommentText("");
    
    toast({
      title: "Comment posted",
      description: "Your comment has been added successfully",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-6">
            <Link to="/notebooks">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Notebooks
              </Button>
            </Link>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{notebook.language}</Badge>
                    {notebook.featured && <Badge variant="default">Featured</Badge>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleLike}>
                      <Heart className="h-4 w-4 mr-2" />
                      {notebook.likes}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardTitle className="text-3xl mb-2">{notebook.title}</CardTitle>
                <p className="text-muted-foreground mb-4">by {notebook.author}</p>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {notebook.views} views
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {notebook.comments} comments
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {notebook.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="pt-6">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg mb-6">{notebook.description}</p>
                  <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-6 rounded-lg">
                    {notebook.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comments ({comments.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Comment form */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts about this notebook..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handlePostComment}>
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Comments list */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>{comment.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm">{comment.author}</p>
                            <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Heart className="h-3 w-3 mr-1" />
                            <span className="text-xs">{comment.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotebookDetail;
