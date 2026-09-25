// ========================================
// EXUS CORE - SISTEMA DE COLISIONES
// ========================================

import * as THREE from "three";

export class CollisionSystem {

    constructor(playerRadius = 0.45) {

        this.playerRadius = playerRadius;

        // Lista de obstáculos
        this.obstacles = [];
    }


    // ========================================
    // AGREGAR OBSTÁCULO
    // ========================================

    addBox(x, z, width, depth) {

        this.obstacles.push({

            minX: x - width / 2,
            maxX: x + width / 2,

            minZ: z - depth / 2,
            maxZ: z + depth / 2

        });

    }


    // ========================================
    // COMPROBAR COLISIÓN
    // ========================================

    isBlocked(x, z) {

        for (const obstacle of this.obstacles) {

            const closestX = Math.max(
                obstacle.minX,
                Math.min(x, obstacle.maxX)
            );

            const closestZ = Math.max(
                obstacle.minZ,
                Math.min(z, obstacle.maxZ)
            );

            const distanceX = x - closestX;
            const distanceZ = z - closestZ;

            const distanceSquared =
                distanceX * distanceX +
                distanceZ * distanceZ;

            if (
                distanceSquared <
                this.playerRadius *
                this.playerRadius
            ) {

                return true;

            }

        }

        return false;

    }


    // ========================================
    // COMPROBAR MOVIMIENTO EN X
    // ========================================

    canMoveX(x, z) {

        return !this.isBlocked(x, z);

    }


    // ========================================
    // COMPROBAR MOVIMIENTO EN Z
    // ========================================

    canMoveZ(x, z) {

        return !this.isBlocked(x, z);

    }


    // ========================================
    // REGISTRAR UN OBJETO 3D
    // ========================================

    addObject(object) {

        const box = new THREE.Box3()
            .setFromObject(object);

        const center = new THREE.Vector3();

        box.getCenter(center);

        const size = new THREE.Vector3();

        box.getSize(size);

        this.addBox(
            center.x,
            center.z,
            size.x,
            size.z
        );

    }

}