
    <!-- Inicio del Modal eliminar orden -->
    <div
      class="modal fade"
      id="eliminarProducto"
      tabindex="-1"
      role="dialog"
      aria-labelledby="agregarProducto"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">
              Eliminar Orden
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h6 style="font-weight: 400; text-align: center">
              ¿Está seguro que quiere eliminar la orden "{{
                ordSelected.idOrden
              }}"?
            </h6>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @Click="removeRegistro()"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin del Modal eliminar orden -->