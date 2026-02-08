import asyncio

from database import classes_collection


async def main() -> None:
    cursor = classes_collection.find({}, {"name": 1})
    print("Classes:")
    async for doc in cursor:
        print(f"- {doc.get('name', '(no name)')} | id={doc.get('_id')}")


if __name__ == "__main__":
    asyncio.run(main())
