var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
var __dirname = path.dirname(fileURLToPath(import.meta.url));
import { uploadErrors } from '../errors/uploads.errors.js';
import { randomNbLtID } from '../utils/utils.js';
import FilesModel from '../models/files.model.js';
import multer from 'multer';
;
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },
});
var filterFile = function (req, file, callback) {
    if (file) {
        var mime_1 = file.mimetype;
        var fileSize = parseInt(req.headers['content-length']);
        try {
            if (mime_1 !== "image/jpg" && mime_1 !== "image/png" && mime_1 !== "image/jpeg") {
                throw Error("invalid file");
            }
            callback(null, true);
        }
        catch (err) {
            var errors = uploadErrors(err);
            Object.assign(req, { errors: errors });
            callback(errors.message);
        }
    }
};
export var upload = multer({
    storage: storage,
    fileFilter: filterFile,
    limits: { fileSize: 2000000 },
});
;
export var uploadImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var __directory, filename_1, compressAndRename;
    return __generator(this, function (_a) {
        __directory = "".concat(__dirname, "/../../uploads");
        if (req.errors) {
            return [2, res.status(400).send({ errors: __assign({}, req.errors) })];
        }
        if (req.file) {
            if (!fs.existsSync(__directory)) {
                fs.mkdirSync(__directory, { recursive: true });
            }
            filename_1 = "".concat(req.file.originalname.replace(path.extname(req.file.originalname), "-".concat(randomNbLtID(24))), ".jpg");
            compressAndRename = new Promise(function (resolve, reject) {
                sharp("".concat(__directory, "/").concat(req.file.originalname))
                    .withMetadata()
                    .jpeg({ mozjpeg: true, quality: 50 })
                    .toFile("".concat(__directory, "/").concat(filename_1), function (err, info) {
                    if (err) {
                        console.error('Sharp error : ' + err);
                    }
                    else {
                        resolve(info);
                    }
                });
            });
            compressAndRename
                .then(function () {
                var isFile = fs.existsSync("".concat(__directory, "/").concat(req.file.originalname));
                if (isFile) {
                    fs.unlink("".concat(__directory, "/").concat(req.file.originalname), function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
            })
                .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, FilesModel.create({
                                name: req.file.originalname,
                                path: "/uploads/".concat(filename_1),
                                size: req.file.size,
                                extension: path.extname(filename_1)
                            })
                                .then(function (docs) {
                                return res.send(docs);
                            })
                                .catch(function (err) {
                                var errors = uploadErrors(err);
                                return res.status(200).send({ errors: errors });
                            })];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        }
        ;
        return [2];
    });
}); };
export var uploadImages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var __directory, _loop_1, i;
    return __generator(this, function (_a) {
        __directory = "".concat(__dirname, "/../../uploads");
        if (req.errors) {
            return [2, res.status(400).send({ errors: __assign({}, req.errors) })];
        }
        if (req.files && Array.isArray(req.files)) {
            if (!fs.existsSync(__directory)) {
                fs.mkdirSync(__directory, { recursive: true });
            }
            _loop_1 = function (i) {
                var file = req.files[i];
                var filename = "".concat(file.originalname.replace(path.extname(file.originalname), "-".concat(randomNbLtID(24))), ".jpg");
                var compressAndRename = new Promise(function (resolve, reject) {
                    sharp("".concat(__directory, "/").concat(file.originalname))
                        .withMetadata()
                        .jpeg({ mozjpeg: true, quality: 50 })
                        .toFile("".concat(__directory, "/").concat(filename), function (err, info) {
                        if (err) {
                            console.error(err);
                        }
                        else {
                            resolve(info);
                        }
                    });
                });
                var response = [];
                compressAndRename
                    .then(function () {
                    var isFile = fs.existsSync("".concat(__directory, "/").concat(file.originalname));
                    if (isFile) {
                        fs.unlink("".concat(__directory, "/").concat(file.originalname), function (err) {
                            if (err) {
                                console.error(err);
                            }
                        });
                    }
                })
                    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, FilesModel.create({
                                    name: file.originalname,
                                    path: "/uploads/".concat(filename),
                                    size: file.size,
                                    extension: path.extname(filename)
                                })
                                    .then(function (docs) {
                                    response = __spreadArray(__spreadArray([], response, true), [docs], false);
                                    if (i === Number(req.files.length) - 1) {
                                        return res.status(200).send(response);
                                    }
                                })
                                    .catch(function (err) {
                                    var errors = uploadErrors(err);
                                    return res.status(200).send({ errors: errors });
                                })];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                }); });
            };
            for (i = 0; i < req.files.length; i++) {
                _loop_1(i);
            }
            ;
        }
        ;
        return [2];
    });
}); };
export var updateImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var __directory, filename_2, compressAndRename;
    return __generator(this, function (_a) {
        __directory = "".concat(__dirname, "/../uploads");
        if (req.errors) {
            return [2, res.status(400).send({ errors: __assign({}, req.errors) })];
        }
        if (req.file) {
            if (!fs.existsSync(__directory)) {
                fs.mkdirSync(__directory, { recursive: true });
            }
            filename_2 = "".concat(req.file.originalname.replace(path.extname(req.file.originalname), "-".concat(randomNbLtID(24))), ".jpg");
            compressAndRename = new Promise(function (resolve, reject) {
                sharp("".concat(__directory, "/").concat(req.file.originalname))
                    .withMetadata()
                    .jpeg({ mozjpeg: true, quality: 50 })
                    .toFile("".concat(__directory, "/").concat(filename_2), function (err, info) {
                    if (err) {
                        console.error('Sharp error : ' + err);
                    }
                    else {
                        resolve(info);
                    }
                });
            });
            compressAndRename
                .then(function () {
                var isFile = fs.existsSync("".concat(__directory, "/").concat(req.file.originalname));
                if (isFile) {
                    fs.unlink("".concat(__directory, "/").concat(req.file.originalname), function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                    var fileToUpdate = req.body.fileToUpdate;
                    if (fileToUpdate) {
                        fs.unlink("".concat(__directory, "/").concat(fileToUpdate), function (err) {
                            if (err) {
                                console.error(err);
                            }
                        });
                    }
                }
            })
                .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, FilesModel.findByIdAndUpdate({
                                _id: req.params.id
                            }, {
                                $set: {
                                    name: req.file.originalname,
                                    path: "/uploads/".concat(filename_2),
                                    size: req.file.size,
                                    extension: path.extname(filename_2)
                                },
                            }, {
                                new: true,
                                runValidators: true,
                                context: 'query',
                            })
                                .then(function (docs) {
                                return res.send(docs);
                            })
                                .catch(function (err) {
                                var errors = uploadErrors(err);
                                return res.status(200).send({ errors: errors });
                            })];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        }
        ;
        return [2];
    });
}); };
