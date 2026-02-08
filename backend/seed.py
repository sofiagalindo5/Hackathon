import asyncio
from datetime import datetime
from database import users_collection, classes_collection

async def seed_db():
    # 🔥 Clear existing data (DEV ONLY)
    await users_collection.delete_many({})
    await classes_collection.delete_many({})

    # --------------------
    # Users
    # --------------------
    users = [
        {"_id": "user_1", "name": "Alice", "email": "alice@example.com"},
        {"_id": "user_2", "name": "Bob", "email": "bob@example.com"},
        {"_id": "user_3", "name": "Charlie", "email": "charlie@example.com"},
        {"_id": "user_4", "name": "Diana", "email": "diana@example.com"},
    ]

    await users_collection.insert_many(users)

    # --------------------
    # Classes + Notes
    # --------------------
    classes = [
        {
            "name": "Biology 101",
            "users": ["user_1", "user_2", "user_3"],
            "photos": [
                {
                    "_id": "note_bio_1",
                    "imageUrl": "https://cloudinary.com/demo/bio1.jpg",
                    "pdfUrl": "https://cloudinary.com/demo/bio1.pdf",
                    "uploadedBy": "user_1",
                    "uploadedAt": datetime.utcnow().isoformat(),
                    "summary": "Introduction to cell theory and microscopy."
                },
                {
                    "_id": "note_bio_2",
                    "imageUrl": "https://cloudinary.com/demo/bio2.jpg",
                    "pdfUrl": "https://cloudinary.com/demo/bio2.pdf",
                    "uploadedBy": "user_2",
                    "uploadedAt": datetime.utcnow().isoformat(),
                    "summary": "Overview of prokaryotic vs eukaryotic cells."
                }
            ]
        },
        {
            "name": "CS 201 – Data Structures",
            "users": ["user_1", "user_4"],
            "photos": [
                {
                    "_id": "note_cs_1",
                    "imageUrl": "https://cloudinary.com/demo/cs1.jpg",
                    "pdfUrl": "https://cloudinary.com/demo/cs1.pdf",
                    "uploadedBy": "user_4",
                    "uploadedAt": datetime.utcnow().isoformat(),
                    "summary": "Arrays, linked lists, and time complexity basics."
                }
            ]
        },
        {
            "name": "Calculus II",
            "users": ["user_2", "user_3", "user_4"],
            "photos": [
                {
                    "_id": "note_calc_1",
                    "imageUrl": "https://cloudinary.com/demo/calc1.jpg",
                    "pdfUrl": "https://cloudinary.com/demo/calc1.pdf",
                    "uploadedBy": "user_3",
                    "uploadedAt": datetime.utcnow().isoformat(),
                    "summary": "Techniques of integration and applications."
                },
                {
                    "_id": "note_calc_2",
                    "imageUrl": "https://cloudinary.com/demo/calc2.jpg",
                    "pdfUrl": "https://cloudinary.com/demo/calc2.pdf",
                    "uploadedBy": "user_2",
                    "uploadedAt": datetime.utcnow().isoformat(),
                    "summary": "Series convergence tests and power series."
                }
            ]
        }
    ]

    await classes_collection.insert_many(classes)

    print("✅ Database seeded successfully")
    print(f"👤 Users: {len(users)}")
    print(f"🏫 Classes: {len(classes)}")

if __name__ == "__main__":
    asyncio.run(seed_db())