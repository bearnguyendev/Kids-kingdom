import db from "../models/index";
require('dotenv').config();

let createNewTypeShip = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.price || !data.type) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                const [res, created] = await db.TypeShip.findOrCreate({
                    where: {
                        type: data.type
                    },
                    defaults: {
                        type: data.type,
                        price: data.price,
                    }
                })
                if (!created) {
                    resolve({
                        errCode: 2,
                        errMessage: `Phương thức vận chuyển ${data.type} đã tồn tại!`
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: 'Tạo mới phương thức vận chuyển thành công!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailTypeShipById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let data = await db.TypeShip.findOne({
                    where: { id: id }
                })
                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllTypeShip = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.TypeShip.findAll()
            resolve({
                errCode: 0,
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getListTypeShip = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.limit) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let res = await db.TypeShip.findAll({
                    limit: +data.limit,
                })
                resolve({
                    errCode: 0,
                    data: res
                })
            }


        } catch (error) {
            reject(error)
        }
    })
}
let updateTypeShip = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.price || !data.type) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let typeShip = await db.TypeShip.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (typeShip) {
                    typeShip.type = data.type;
                    typeShip.price = data.price;
                    await typeShip.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Cập nhật thông tin phương thức vận chuyển thành công!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy phương thức vận chuyển để chỉnh sửa!'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let deleteTypeShip = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các thông số bắt buộc!'
                })
            } else {
                let typeShip = await db.TypeShip.findOne({
                    where: { id: data.id }
                })
                if (typeShip) {
                    let typeShipUsed = db.OrderProduct.findOne({
                        where: { typeShipId: data.id }
                    })
                    if (typeShipUsed) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không thể xoá phương thức vận chuyển đã được sử dụng!'
                        })
                    } else {
                        await db.TypeShip.destroy({
                            where: { id: data.id }
                        })
                        resolve({
                            errCode: 0,
                            errMessage: 'Xoá phương thức vận chuyển thành công!'
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy phương thức vận chuyển!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createNewTypeShip: createNewTypeShip,
    getDetailTypeShipById: getDetailTypeShipById,
    getAllTypeShip: getAllTypeShip,
    getListTypeShip: getListTypeShip,
    updateTypeShip: updateTypeShip,
    deleteTypeShip: deleteTypeShip,
}