import Message from "../Model/MessageModel.js";

const addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await Message.create({
            message: {
                text:message,
            },
            users: [from, to],
            sender:from,
        })

        if (data) {
            return res.status(200).json({ msg: "Message added successfully",data })
            
        }
        
        if (!data) {
          return res.status(500).json({ msg: "Message not added" });
        }
    } catch (error) {
        next(error)
        console.log(error)
    }
}

const getAllMesssage = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await Message.find({
            users: {
                $all:[from,to],
            },
        }).sort({ updatedAt: 1 })
        
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message:msg.message.text,
            }
        })
        return res.status(200).json(projectedMessages)
    } catch (error) {
        next(error)
        console.log(error)
    }
}
export { addMessage, getAllMesssage };