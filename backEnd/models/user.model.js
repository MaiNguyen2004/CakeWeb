const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        nickName: {
            type: String,
            required: true,
            trim: true,
            minLength: [2, "Nickname must be at least 2 characters"],
            maxLength: [50, "Nickname too long"]
        },

        fullName: {
            type: String,
            trim: true,
            minLength: [2, "Must be at least 2 characters"],
            maxLength: [100, "Too long"]
        },

        email: {
            type: String,
            required: [true, "Email address required"],
            trim: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"]
        },

        password: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    // nếu đã hash thì bỏ qua
                    if (value.startsWith('$2b$')) return true;

                    return value.length >= 6;
                },
                message: "Password không hợp lệ"
            }
        },
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true
        },
        gender: {
            type: String,
            enumb: ["male, female"],
            default: "male"
        },

        dob: {
            type: Date,
            validate: {
                validator: function (v) {
                    return v <= new Date();
                },
                message: "Date of birth cannot be in the future"
            }
        },

        address: {
            type: String,
        },

        phone: {
            type: String,
            match: [/^[0-9]{9,11}$/, "Invalid phone number"],
        },

        avatar: {
            type: String,
            default: 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='
        },
        bio: {
            type: String,
            minLength: 200
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
