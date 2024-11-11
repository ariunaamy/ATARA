const express = require("express")
const router = express.Router()
const axios = require("axios")
const mindee = require("mindee")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

// Get all products in one receipt
router.get("/:id/products", async (req, res) => {
    try {
        const id = req.params.id
        const receipt = await prisma.receipt.findUnique({
            where: { id },
            include: {
                products: {
                    include: { product: true },
                },
            },
        })
        if (!receipt) {
            return res.status(404).json({ error: "Receipt not found" })
        }
        const productsInReceipt = receipt.products.map((rp) => rp.product)
        res.json(productsInReceipt)
    } catch (error) {
        console.error("Error fetching products:", error)
        res.status(500).json({ error: "Failed to retrieve products in receipt" })
    }
})

// Get all receipts
router.get("/", async (req, res) => {
    try {
        const allReceipts = await prisma.receipt.findMany()
        res.json(allReceipts)
    } catch (error) {
        console.error("Error fetching all receipts:", error)
        res.status(500).json({ error: "Failed to retrieve receipts" })
    }
})

// Get one receipt
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const receipt = await prisma.receipt.findUnique({ where: { id } })
        if (!receipt) {
            return res.status(404).json({ error: "Receipt not found" })
        }
        res.json(receipt)
    } catch (error) {
        console.error("Error fetching receipt:", error)
        res.status(500).json({ error: "Failed to retrieve receipt" })
    }
})

// Create new receipt
router.post("/", async (req, res) => {
    const receiptOcrEndpoint = "https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict"
    const mindeeClient = new mindee.Client({ apiKey: "d08debaaf613b1da78ff63683fdd2d24" })

    try {
        const inputSource = mindeeClient.docFromBase64(req.body.photo, "receiptFile.jpg")
        const apiResponse = await mindeeClient.parse(mindee.product.ReceiptV5, inputSource)
        console.log(apiResponse.document.toString())

        const receiptResult = await axios.post(
            receiptOcrEndpoint,
            { document: req.body.photo },
            {
                headers: { Authorization: "Token d08debaaf613b1da78ff63683fdd2d24" },
            },
        )

        if (receiptResult.data.error) {
            console.error("OCR API error:", receiptResult.data.error)
            return res.status(500).json({ error: "OCR API error" })
        }

        let productsOnReceipt
        try {
            productsOnReceipt = receiptResult.data.document.inference.pages[0].prediction.line_items.map(
                (item) => ({
                    name: item.description,
                    quantity: item.quantity,
                }),
            )
        } catch (error) {
            console.error("Error parsing OCR result:", error)
            return res.status(400).json({ error: "Could not parse receipt" })
        }

        const productsFromDB = await prisma.product.findMany({
            where: {
                name: { in: productsOnReceipt.map((product) => product.name) },
            },
        })

        const productUserLinks = productsFromDB.map((product) => ({
            productId: product.id,
            quantity: 1,
        }))

        const newReceipt = await prisma.receipt.create({
            data: {
                userId: req.body.userId,
                products: { create: productUserLinks },
            },
        })

        res.json({ ...newReceipt, products: productsFromDB })
    } catch (error) {
        console.error("Error creating receipt:", error)
        res.status(500).json({ error: "Failed to create receipt" })
    }
})

// Delete receipt
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const deletedReceipt = await prisma.receipt.delete({ where: { id } })
        res.json(deletedReceipt)
    } catch (error) {
        console.error("Error deleting receipt:", error)
        res.status(500).json({ error: "Failed to delete receipt" })
    }
})

module.exports = router
