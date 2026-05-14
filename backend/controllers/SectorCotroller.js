const {Sector}= require('../models');

const crearSector = async (req,res)=>{
    const {nombre,color_hex} = req.body;
    try{
        const sector = await Sector.create({
            nombre,
            color_hex
        });
        res.status(201).json({message: 'Sector creado exitosamente', sector});
    }catch(error){
        res.status(500).json({message: 'Error al crear el sector', error});
    }
}

const ObtenerSectores = async (req,res)=>{
    try{
const sectors = await Sector.findAll();
res.status(200).json(sectors); 

    }catch (error){
        res.status(500).json({message: 'Error al obtener los sectores', error});
    }
}

const eliminarSector = async (req,res)=>{
    try{
        const {id_sector} = req.params;

        const sectorEncontrado =await Sector.findByPk(id_sector);
        if(!sectorEncontrado){
            return res.status(404).json({message: 'Sector no encontrado'});
        }
        await sectorEncontrado.destroy()
        res.status(200).json({message: 'Sector eliminado correctamente'});

    }catch (error){
        res.status(500).json({message: 'Error al eliminar el sector', error});
    }
}

const editarSector = async (req,res)=>{
    try{
        const {id_sector} = req.params;

        const {nombre,color_hex} = req.body;

        const sectorEncontrado = await Sector.findByPk(id_sector);

        if(!sectorEncontrado){
            return res.status(404).json({message: 'Sector no encontrado'});
        }

        await sectorEncontrado.update({nombre,color_hex});

        res.status(200).json(sectorEncontrado);

    }catch (error){
        res.status(500).json({message: 'Error al editar el sector', error});
    }
}

module.exports = {
    crearSector,
    ObtenerSectores,
    eliminarSector,
    editarSector
}   
