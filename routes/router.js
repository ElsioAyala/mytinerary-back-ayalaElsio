import express, {json} from 'express' 
import { Router } from 'express'
import {getCliente} from '../controllers/cliente.js'

const router = Router()

router.get('/clientes', getCliente)

export default router